import React, { useEffect, useState } from 'react'
import axiosInstance from '../Services/axiosInstance'
import { CiEdit } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { IoChevronBackCircle } from 'react-icons/io5';
import toast from 'react-hot-toast';

const AdminForm1 = () => {
    const [clientDetails, setClietDetails] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [sendingData, setSendingData] = useState([]);
    const [feasabilityData, setFeasabilityData] = useState([]);
    const [criteriaData, setCriteriaData] = useState([]);
    const [criteriaDataDupli, setCriteriaDataDupli] = useState([]);
    const [originalBoundaryType, setOriginalBoundaryType] = useState([]);
    const [editingFeadibilityData, setEditingFeadibilityData] = useState({});
    const [editingFeadibilityIndex, setEditingFeadibilityIndex] = useState(Number);
    const [glowOne, setGlowOne] = useState(false);
    const [glowTwo, setGlowTwo] = useState(false);
    const [validation, setvalidation] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false)
    const feasabilityPlaceholder = [1, 2];
    const bountaryValueplaceholder = [1, 2, 3, 4];
    const criteriaPlaceholder = [1, 2, 3, 4];
    const pageRender = useNavigate();

    const [question, setQuestion] = useState("");
    const [bountryType, setBountryType] = useState("");
    const [boundaryValue, setBoundaryValue] = useState("");
    const [questionType, setQuestionType] = useState("");
    const [toolTip, serToolTip] = useState("")

    const [clientId, setClientId] = useState(Number);
    const [serviceId, setServiceId] = useState(Number)
    const [productId, setProductId] = useState(Number);

    //api request function
    const getClients = async () => {
        try {
            const res = await axiosInstance.get("/get_clients")
            if (res.data.error_code === 200) {
                setClietDetails(res.data.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleGetProducts = async (clientId, serviceId) => {
        try {
            const obj = {
                client_id: clientId,
                service_id: serviceId
            }

            const res = await axiosInstance.post("/get_parent_products", obj)

            if (res.data.error_code === 200) {
                setProductDetails(res.data.data)
                setGlowOne(false)
            } else {
                setGlowOne(false)
            }

        } catch (err) {
            console.log(err)
        }
    }

    const handleGetFesability = async (product_id, client_id, service_id) => {
        try {
            const obj = {
                client_id: client_id,
                service_id: service_id,
                product_id: product_id
            }

            console.log(obj)
            const res = await axiosInstance.post("/get_product_feasibility", obj)
            if (res.data.error_code === 200) {
                if (res.data.data.length > 0) {
                    setSendingData(res.data.data)
                    setFeasabilityData(res.data.data[0].feasibility)
                    setCriteriaData(res.data.data[0].attribute)
                    setCriteriaDataDupli(res.data.data[0].attribute)
                    setGlowTwo(false)
                } else {
                    setGlowTwo(false)
                }
            }
        } catch (err) {

        }
    }
    //

    //onChange functions
    const handleClient = (e) => {

        if (e.target.value !== '') {
            setGlowOne(true)
            setFeasabilityData([]);
            setCriteriaData([]);

            const myArray = e.target.value.split(",")


            setClientId(parseInt(myArray[0]));
            setServiceId(parseInt(myArray[1]))

            handleGetProducts(parseInt(myArray[0]), parseInt(myArray[1]))
        }
    }

    const handleProducts = (e) => {
        if (e.target.value !== '') {
            setGlowTwo(true)
            handleGetFesability(e.target.value, clientId, serviceId)
            setProductId(e.target.value)
        }
    }
    //

    const dynamicBountryType = () => {
        switch (bountryType) {
            case "in":
            case "notin":
                return <>
                    <option value="in">in</option>
                    <option value="notin">not in</option>
                </>

            case ">":
            case "<":
            case ">=":
            case "<=":
                return <>
                    <option value=">">{`>`}</option>
                    <option value="<">{`<`}</option>
                    <option value=">=">{`>=`}</option>
                    <option value="<=">{`<=`}</option>
                </>

            default:
                break;
        }

    }

    const handleFeasibilityEdit = (index, value) => {
        setEditingFeadibilityIndex(index);
        setEditingFeadibilityData(value);
        setOriginalBoundaryType(value.bountary_type);

        const joinBountryValue = value.bountary_value.join(',');

        setQuestion(value.question);
        setBoundaryValue(joinBountryValue)
        setBountryType(value.bountary_type)
        setQuestionType(value.question_type)
        if (value.tool_tip === null) {
            serToolTip("")
        } else {
            serToolTip(value.tool_tip)
        }
    }

    const handleCriteriaEdit = () => {
        return criteriaDataDupli.map((v, i) => {
            return <>
                <div className="col-6">
                    <input type="text" value={v.attribute_name} className={`form-control ${v.attribute_name === "" && validation ? "border-danger" : ""}`} onChange={(e) => handleCriteriaModalIp(e, v.attribute_id)} required />
                </div>
            </>
        })
    }

    const handleCriteriaModalIp = (event, criteriaId) => {
        var newCriteriaArray = criteriaDataDupli.map((v) => {
            return v.attribute_id === criteriaId ? { ...v, attribute_name: event.target.value } : v
        })

        setCriteriaDataDupli(newCriteriaArray)
    }

    const handleSaveChanges = (modalName) => {
        if (modalName === "feasibility") {
            if (question !== "" && boundaryValue !== "") {
                const bountryValueSplit = boundaryValue.split(',');
                const checkingIfAnythingIsEmpty = bountryValueSplit.filter((v) => {
                    return v !== '' ? v.trim() : null
                })

                const checkbountryValueisFinite = checkingIfAnythingIsEmpty.filter((v) => {
                    return isFinite(v) ? v : null
                })

                if (questionType === "numeric") {
                    if (checkbountryValueisFinite.length === checkingIfAnythingIsEmpty.length) {
                        const newObj = { ...editingFeadibilityData }
                        newObj.question = question
                        newObj.bountary_value = checkingIfAnythingIsEmpty
                        newObj.question_value = checkingIfAnythingIsEmpty
                        newObj.bountary_type = bountryType
                        newObj.tool_tip = toolTip

                        const newEdittedObject = feasabilityData.map((v, i) => {
                            return i === editingFeadibilityIndex ? newObj : v
                        })
                        setFeasabilityData(newEdittedObject)

                        const newModifiedFesaibilityData = { ...sendingData[0] }
                        newModifiedFesaibilityData.feasibility = newEdittedObject
                        setSendingData([newModifiedFesaibilityData])

                        document.getElementById("closeFeasibilityModal").click();
                        setvalidation(false);
                    } else {
                        toast.error("bountry value should be in number")
                    }
                } else {
                    const newObj = { ...editingFeadibilityData }
                    newObj.question = question
                    newObj.bountary_value = bountryValueSplit
                    newObj.question_value = bountryValueSplit
                    newObj.bountary_type = bountryType
                    newObj.tool_tip = toolTip

                    const newEdittedObject = feasabilityData.map((v, i) => {
                        return i === editingFeadibilityIndex ? newObj : v
                    })
                    setFeasabilityData(newEdittedObject)

                    const newModifiedFesaibilityData = { ...sendingData[0] }
                    newModifiedFesaibilityData.feasibility = newEdittedObject
                    setSendingData([newModifiedFesaibilityData])

                    document.getElementById("closeFeasibilityModal").click();
                    setvalidation(false);
                }

            } else {
                setvalidation(true)
            }
        } else {
            const validateError = criteriaDataDupli.filter((v) => {
                return v.attribute_name !== ""
            })

            if (validateError.length === criteriaDataDupli.length) {
                const newModifiedCriteriaData = { ...sendingData[0] }
                newModifiedCriteriaData.product_id = ""
                newModifiedCriteriaData.attribute = criteriaDataDupli
                setSendingData([newModifiedCriteriaData])
                setCriteriaData(criteriaDataDupli)

                document.getElementById("closeCriteria").click();
                setvalidation(false);
            } else {
                setvalidation(true);
            }

        }
    }

    const handleUpdate = async () => {
        setUpdateLoading(true)
        try {
            const newUpdationData = { ...sendingData[0] }
            newUpdationData.product_id = 0

            console.log(newUpdationData,"newUpdationData")

            const res = await axiosInstance.post("/update_feasibility", newUpdationData)
            if (res.data.error_code === 200) {
                setUpdateLoading(false)
                toast.success("Updated successfully")
            } else {
                setUpdateLoading(false)
                toast.error(res.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== null) {
            getClients();
        } else {
            pageRender("/")
        }
    }, [])

    return (
        <div className="admin-page-content-height py-4 placeholder-glow">
            <div className="card h-100 overflowY overflowX py-3">
                <div className="w-100 p-3">
                    <button className="btn btn-outline-secondary d-flex align-items-center gap-2 ms-1 py-1 px-2" onClick={() => {
                        pageRender("/")
                    }}>
                        <IoChevronBackCircle className="fs-5" /> Back
                    </button>
                </div>
                <div className="px-3">
                    <div className="card">
                        <div className="card-body">
                            <h5 className='fw-bold'>Client Information</h5>
                            <div className='row pt-4'>
                                <div className="col-6 mb-3">
                                    <label htmlFor="clientName" className="form-label fw-bold" aria-label="Default select example">Client name</label>
                                    <select className='form-select' id="clientName" onChange={handleClient}>
                                        <option value="">select client</option>
                                        {
                                            clientDetails.map((v, i) => {

                                                 return v.name === "Toyota" || v.name === "Unger Cleaning Tools" || v.name.toLowerCase().includes("demo") ? null : <option value={[v.id, v.services[0].id]} key={i}>{v.name}</option>
                                            })
                                        }
                                    </select>
                                </div>

                                <div className="col-6 mb-3">
                                    {
                                        glowOne ?
                                            <>
                                                <label htmlFor="clientName" className="form-label placeholder py-2 pb-3 w-50 rounded" aria-label="Default select example"></label>
                                                <select className='form-select placeholder py-4=3 w-100 rounded' id="clientName" >

                                                </select>
                                            </>
                                            :
                                            <>
                                                <label htmlFor="clientName" className="form-label fw-bold" aria-label="Default select example">Product name</label>
                                                <select className='form-select' id="clientName" onChange={handleProducts}>
                                                    <option value="">select product</option>
                                                    {
                                                        productDetails.map((v, i) => {
                                                            return <option value={v.id} key={i}>{v.name}</option>
                                                        })
                                                    }
                                                </select>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    glowTwo ?
                        <>
                            <div className="p-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className='placeholder w-25 py-2 pb-3 rounded'></h5>
                                        {
                                            feasabilityPlaceholder.map((v, i) => {
                                                return <div className="col-12 d-flex flex-wrap gy-3 pt-4 border-bottom p-2 my-2 rounded" key={i}>
                                                    <div className="col-12 position-relative">
                                                        <p className='placeholder py-2 pb-3 w-25 rounded'></p>
                                                        <p className='placeholder py-4 w-100 rounded'>{v.question}</p>
                                                        <div className="edit-btn">
                                                            <button type='button' className='btn btn-primary px-5 placeholder py-1'></button>
                                                        </div>
                                                    </div>

                                                    <div className="col-6">
                                                        <p className='placeholder py-2 pb-3 w-25 rounded'></p>
                                                        <p className='px-5 placeholder py-2 pb-3 rounded col-11'></p>
                                                    </div>

                                                    <div className="col-6">
                                                        <p className='placeholder py-2 pb-3 w-25 rounded'></p>
                                                        <div className="row gy-2">
                                                            {bountaryValueplaceholder.map((v, i) => {
                                                                return <div className='col-6'>
                                                                    <div className="card placeholder w-100 py-2">
                                                                        <div className="card-body py-2 pb-3">

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="col-6">
                                                        <p className='placeholder py-2 pb-3 w-25 rounded'></p>
                                                        <p className='placeholder py-2 pb-3 w-100 rounded'></p>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="p-3">
                                <div className="card">
                                    <div className="card-body ">
                                        <h5 className='w-25 py-2 pb-3 rounded placeholder'></h5>
                                        <div className="criteria-edit-btn">
                                            <button type='button' className='btn btn-primary px-5 placeholder py-1'></button>
                                        </div>
                                        <div className="row py-4">
                                            {
                                                criteriaPlaceholder.map((v, i) => {
                                                    return <div className='col' key={i}>
                                                        <div className="card py-3 placeholder w-100">
                                                            <div className="card-body py-1">
                                                            </div>
                                                        </div>
                                                    </div>

                                                })
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        feasabilityData.length > 0 ?
                            <div className="p-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className='fw-bold'>Constraints</h5>
                                        {
                                            feasabilityData.map((v, i) => {
                                                return <div className="col-12 d-flex flex-wrap gy-3 pt-4 border-bottom p-2 my-2 rounded" key={i}>
                                                    <div className="col-12 position-relative">
                                                        <p className='fw-bold mb-0'>{i + 1}.Question: </p>
                                                        <p>{v.question}</p>
                                                        <div className="edit-btn">
                                                            <button type='button' className='btn btn-primary' onClick={() => {
                                                                setvalidation(false)
                                                                handleFeasibilityEdit(i, v)
                                                            }} data-bs-toggle="modal" data-bs-target="#feasibilityModal"><CiEdit className='fs-5' /></button>
                                                        </div>
                                                    </div>

                                                    <div className="col-6">
                                                        <p className='fw-bold mb-0'>Type:</p>
                                                        <p> {v.bountary_type === "value" ? "drop-down" : v.bountary_type}</p>
                                                    </div>

                                                    <div className="col-6">
                                                        <p className='fw-bold mb-0'>Value: </p>
                                                        <div className="row gy-2">
                                                            {v.bountary_value ?
                                                                v.bountary_value.map((v, i) => {
                                                                    return <div className='col-12 col-md-6' key={i}>
                                                                        <div className="card">
                                                                            <div className="card-body py-1">
                                                                                {v}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                })
                                                                :
                                                                null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="col-6">
                                                        <p className='fw-bold mb-0'>Tool tip:</p>
                                                        <p> {v.tool_tip === null || v.tool_tip === '' ? "tooltip content is empty" : v.tool_tip}</p>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            null
                }

                {
                    criteriaData.length > 0 ?
                        <div className="p-3">
                            <div className="card">
                                <div className="card-body ">
                                    <h5 className='fw-bold'>Attributes</h5>
                                    <div className="criteria-edit-btn">
                                        <button type='button' className='btn btn-primary' onClick={() => {
                                            handleCriteriaEdit()
                                            setvalidation(false)
                                            setCriteriaDataDupli(criteriaData)
                                        }} data-bs-toggle="modal" data-bs-target="#criteriaModal"><CiEdit className='fs-5' /></button>
                                    </div>
                                    <div className="row gy-3 py-4">
                                        {
                                            criteriaData.map((v, i) => {
                                                return <div className='col-12 col-md-4 col-lg-3' key={i}>
                                                    <div className="card">
                                                        <div className="card-body py-1">
                                                            {v.attribute_name}
                                                        </div>
                                                    </div>
                                                </div>

                                            })
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                        :
                        null
                }

                {
                    feasabilityData.length > 0 || criteriaData.length > 0 ?
                        <div className="d-grid gap-2 col-6 mx-auto">
                            {
                                updateLoading ?
                                    <button type='button' className='btn btn-primary d-flex align-items-center justify-content-center' disabled>
                                        <div className="spinner-border" role="status"></div>
                                        <span className='ps-2'>Updating</span>
                                    </button>
                                    :
                                    <button type='button' className='btn btn-primary' onClick={handleUpdate}>Update</button>
                            }
                        </div>
                        :
                        null
                }
            </div>

            {/* feasibility modal box */}
            <div className="modal fade" id="feasibilityModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Question {editingFeadibilityIndex + 1}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeFeasibilityModal"></button>
                        </div>
                        <div className="modal-body">
                            <div className='p-3 row'>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputQuestion" className="form-label">Question</label>
                                        <input type="text" className={`form-control ${question === "" && validation ? "border-danger" : ""}`} id="exampleInputQuestion" value={question} onChange={(e) => setQuestion(e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="exampleInputBountry" className="form-label">Value</label>
                                        {
                                            originalBoundaryType === "value" || originalBoundaryType === "in" ?
                                                <>
                                                    <textarea rows={4} className={`form-control ${boundaryValue === "" && validation ? "border-danger" : ""}`} id="exampleInputBountry" value={boundaryValue} onChange={(e) => setBoundaryValue(e.target.value)} />
                                                    <p className='text-muted'>
                                                        <span className='px-1 '>Ex:</span>
                                                        seperated by "," like 123,456
                                                    </p>
                                                </>

                                                :
                                                <input type="number" className={`form-control ${boundaryValue === "" && validation ? "border-danger" : ""}`} id="exampleInputBountry" value={boundaryValue} onChange={(e) => setBoundaryValue(e.target.value)} />
                                        }

                                    </div>

                                    {questionType === "numeric" ?
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputBountry" className="form-label">Type</label>
                                            <select className={`form-select w-50 ${bountryType === "" && validation ? "border-danger" : ""}`} value={bountryType} onChange={(e) => setBountryType(e.target.value)}>
                                                {dynamicBountryType()}
                                            </select>
                                        </div>
                                        :
                                        null
                                    }

                                    <div className="mb-3">
                                        <label htmlFor="exampleInputTooltip" className="form-label">Tool tip</label>
                                        <input type="text" className={`form-control ${toolTip === "" && validation ? "border-danger" : ""}`} id="exampleInputTooltip" value={toolTip} onChange={(e) => serToolTip(e.target.value)} />
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleSaveChanges("feasibility")}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* criteria modal box */}
            <div className="modal fade" id="criteriaModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attributes</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeCriteria"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row gy-3">
                                {handleCriteriaEdit()}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={() => handleSaveChanges("criteria")}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminForm1