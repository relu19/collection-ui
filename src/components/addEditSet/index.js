import React, { useEffect, useState } from "react";
import './style.scss';
import AddEditCategory from "./addEditCategory";
import AddEditType from "./addEditType";
import { getCategoriesWithSetTypes } from "../../actions/type";
import { useDispatch, useSelector } from "react-redux";
import Actions from '../../actions/api';
import { getStorageItem } from '../../storage';

const AddEditSet = ({data, setModal, onSave, fetchData}) => {
    const length = data?.length || 0
    const lastOrder = data.length ? data[length - 1].order + 1 : 1
    const defaultState = {
        id: data?.id,
        name: data?.name || '',
        minNr: data?.minNr ?? 1,
        maxNr: data?.maxNr ?? 70,
        link: data?.link || '',
        image: data?.image || '',
        extraNumbers: data?.extraNumbers || '',
        extraNumbersText: (() => {
            try {
                return JSON.stringify(JSON.parse(data?.extraNumbers || '[]'), null, 2);
            } catch {
                return data?.extraNumbers || '';
            }
        })(),
        extraNumbersTitle: data?.extraNumbersTitle || 'Extra Numbers',
        group: data?.group || '',
        categoryId: data?.categoryId || '',
        setTypeId: data?.setTypeId || '',
        order: data?.order || lastOrder
    };


    // const test2 = [
    //     {
    //         "number": "relu22",
    //         "desc": "BMW 3181"
    //     },
    //     {
    //         "number": "relu442",
    //         "desc": "pEntera1"
    //     },
    //     {
    //         "number": "lalalla",
    //         "desc": "Motor: 1500cc"
    //     }]

    const [newSet, setNewSet] = useState(defaultState);
    const categories = useSelector((cat) => cat.categoriesReducer);
    const [error, setError] = useState('')
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const isEdit = !!data?.name

    const updateCategories = () => {
        getCategoriesWithSetTypes(dispatch)
    }

    useEffect(() => {
        updateCategories()
    }, []);


    const closeModal = () => {
        setModal(false)
        setError('')
    }

    const onSaveClick = async () => {
        const {
            name,
            minNr,
            maxNr,
            categoryId,
            setTypeId,
            order,
            link,
            image,
            extraNumbersText,
            extraNumbersTitle,
            id,
        } = newSet;

        // Check authentication first
        const authData = localStorage.getItem('auth');
        if (!authData) {
            setError("You must be logged in to add/edit sets. Please sign in with Google.");
            return;
        }

        let parsedAuth;
        try {
            parsedAuth = JSON.parse(authData);
            if (!parsedAuth?.token) {
                setError("Your session has expired. Please log out and sign in again.");
                return;
            }
        } catch (e) {
            setError("Authentication error. Please log out and sign in again.");
            return;
        }

        const userDetails = getStorageItem("collector-data");
        const userId = userDetails?.id;

        if (
            !name ||
            minNr === null || minNr === undefined ||
            maxNr === null || maxNr === undefined ||
            !categoryId ||
            !setTypeId ||
            !order ||
            !link ||
            !image
        ) {
            setError("Fields with * are Required");
            return;
        }

        let extraNumbersString = "[]";
        let isExtraNumbersEmpty = true;

        if (extraNumbersText && extraNumbersText.trim() !== "") {
            try {
                const parsed = JSON.parse(extraNumbersText);
                if (!Array.isArray(parsed)) throw new Error("Not an array");
                isExtraNumbersEmpty = parsed.length === 0;
                extraNumbersString = JSON.stringify(parsed);
            } catch (e) {
                setError("Extra Numbers is not valid JSON");
                return;
            }
        }

        setError("");
        setLoading(true);

        try {
            if (isExtraNumbersEmpty && id && userId) {
                await Actions.deleteExtraNumbers(id, userId);
            }

            const cleanSet = { ...newSet };
            delete cleanSet.extraNumbersText;

            cleanSet.extraNumbers = extraNumbersString;
            await onSave(cleanSet);

            fetchData();
            setModal(false);
            setNewSet(defaultState);
        } catch (e) {
            // Don't show error if it was already handled (like session expiration)
            if (e?.handled) {
                return;
            }
            console.error("Error saving set:", e);
            setError("Failed to save set. Please try again or contact support.");
        }

        setLoading(false);
    };


    return (<div>
            <div className='modal-header'>
                {!data.name ? 'Add a New Set' : 'Edit Set'}
            </div>
            <div className='modal-content'>
                <div className='modal-info-message'>
                    <p><strong>Tip:</strong> To create a set with only extra numbers, set both "First Number" and "Last Number" to 114.</p>
                </div>
                <div className='modal-form'>
                    <label>Set Name*</label>
                    <input type='text' value={newSet.name}
                           onChange={(e) => setNewSet({...newSet, name: e.target.value})}/>

                    <label>First Number*</label>
                    <input type='number' value={newSet.minNr}
                           onChange={(e) => setNewSet({...newSet, minNr: parseInt(e.target.value)})}/>

                    <label>Last Number*</label>
                    <input type='number' value={newSet.maxNr}
                           onChange={(e) => setNewSet({...newSet, maxNr: parseInt(e.target.value)})}/>

                    <AddEditCategory update={updateCategories} categories={categories} newSet={newSet}
                                     setNewSet={setNewSet} isEdit={isEdit} setError={setError}/>
                    <AddEditType update={updateCategories} categories={categories} newSet={newSet}
                                 setNewSet={setNewSet} isEdit={isEdit} setError={setError}/>

                    <label>Set Link*</label>
                    <input type='text' value={newSet.link}
                           onChange={(e) => setNewSet({...newSet, link: e.target.value})}/>

                    <label>Set Image*</label>
                    <input type='text' value={newSet.image}
                           onChange={(e) => setNewSet({...newSet, image: e.target.value})}/>

                    <label>Set Order*</label>
                    <input type='number' value={newSet.order}
                           onChange={(e) => setNewSet({...newSet, order: parseInt(e.target.value)})}/>

                    <label>Group</label>
                    <input type='text' value={newSet.group}
                           onChange={(e) => setNewSet({...newSet, group: e.target.value})}/>

                    <label>Extra Numbers</label>
                    <input
                        type='text'
                        value={newSet.extraNumbersTitle || 'Extra Numbers'}
                        onChange={(e) =>
                            setNewSet({ ...newSet, extraNumbersTitle: e.target.value })
                        }
                        placeholder="Extra Numbers"
                        style={{ marginTop: '5px' }}
                    />


                    <textarea
                        value={newSet.extraNumbersText}
                        onChange={(e) =>
                            setNewSet({ ...newSet, extraNumbersText: e.target.value })
                        }
                        rows={10}
                        style={{ width: '100%' }}
                        placeholder="Paste JSON array of extra numbers here..."
                    />

                </div>
            </div>
            <p className='modal-error'>{error}</p>
            <hr/>
            <div className='modal-footer'>
                <input className='button' type='button' value='Cancel'
                       onClick={() => closeModal()} disabled={loading}/>
                <input className='button' type='button' value={loading ? 'Saving...' : 'Save'}
                       onClick={() => onSaveClick()} disabled={loading}/>
            </div>
        </div>

    )
}


export default AddEditSet