import React, { useReducer, useEffect, useCallback } from 'react';
import InputFile from './InputFile';
import T from 'prop-types';

const initState = {
    lineNumber: -1,
    linesData: [],
    aborted: false,
    errors: [],
    done: false,
    uploadedCount: 0
};

function reducer(state, action) {
    switch (action.type) {
        case 'next':
            const done = state.done || state.lineNumber + 1 === state.linesData.length;
            const nextIndex = done ? state.lineNumber : state.lineNumber + 1;

            return { ...state, lineNumber: nextIndex, done };
        case 'new':
            const { data } = action;
            return { ...initState, linesData: data, lineNumber: 0 };
        case 'error':
            return { ...state, errors: [...state.errors, { line: state.lineNumber + 1, errorMessage: action.errorMessage }] };
        case 'done':
            return { ...state, done: true };
        case 'uploaded':
            return { ...state, uploadedCount: state.uploadedCount + 1 };
        default:
            throw new Error();
    }
}

const CsvUpload = ({ processData }) => {
    const [state, dispatch] = useReducer(reducer, initState);

    const { lineNumber, linesData, done, errors, uploadedCount } = state;

    const onError = useCallback(e => {
        dispatch({ type: 'error', errorMessage: e.message });

        if (window.confirm(`Error is occurred. \n ${e.message} \n Continue?`)) {
            dispatch({ type: 'next' })
        } else {
            dispatch({ type: 'done' });
        }
    }, [dispatch]);

    const onAbort = () => dispatch({ type: 'done' });
    const onSuccess = useCallback(() => {
        dispatch({ type: 'uploaded' }); 
        dispatch({ type: 'next' }); 
    }, [dispatch]);

    const onFileSelect = text => {
        const [, ...data] = text;
        dispatch({ type: 'new', data });
    };

    const uploadLine = useCallback(() => {
        if (lineNumber === -1)
            return;

        processData(linesData[lineNumber])
            .then(onSuccess)
            .catch(onError);
    }, [onSuccess, onError, lineNumber, linesData, processData]);

    useEffect(uploadLine, [uploadLine]);

    return (
        <div className="container">
            <InputFile onFileSelect={onFileSelect} />

            <button type="button" onClick={onAbort}>Abort</button>
            {lineNumber !== -1 &&
                <div>Uploading...({lineNumber + 1}/{linesData.length})</div>
            }
            { done &&
                <div style={{ marginTop: '15px' }}>
                    Summary
                    <div>Successfully uploaded {uploadedCount} items</div>

                    {!!errors.length &&
                        <div style={{ marginTop: '15px' }}>
                            <div>Errors</div>
                            {errors.map(({ line, errorMessage }) => <div key={line}>#{line} - {errorMessage}</div>)}
                        </div>
                    }
                </div>
            }
        </div>
    );
};

CsvUpload.propTypes = {
    processData: T.func.isRequired
};

export default CsvUpload;
