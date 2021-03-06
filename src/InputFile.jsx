import React, { useRef, useCallback } from 'react';
import T from 'prop-types';

const InputFile = ({ onFileSelect }) => {
    const fileInput = useRef();

    const onChange = useCallback(() => {
        const reader = new FileReader();
        reader.onload = e => { onFileSelect(e.target.result.split('\n')); };
        reader.readAsText(fileInput.current.files[0]);
    }, [onFileSelect]);

    return <input type="file" onChange={onChange} ref={fileInput} />
};

InputFile.propTypes = {
    onFileSelect: T.func.isRequired
};

export default InputFile;
