import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const Owner = (props) => {
    const [editable, setEditable] = useState(false);
    const [updatedOwnerName, setUpdatedOwnerName] = useState(props.ownerName);

    const handleUpdate = () => {
        props.updateOwner(updatedOwnerName);
        setEditable(false);
    };

    return (
        <div className="owner">
            {editable ? (
                <input
                    type="text"
                    value={updatedOwnerName}
                    onChange={(e) => setUpdatedOwnerName(e.target.value)}
                />
            ) : (
                <h1>{props.ownerId} {props.ownerName} {props.ownerAge}</h1>
            )}
            <button onClick={() => props.deleteOwner(props.id)}>X</button>
            {editable ? (
                <button onClick={handleUpdate}>Update</button>
            ) : (
                <button onClick={() => setEditable(true)}>Edit</button>
            )}
        </div>
    );
};
