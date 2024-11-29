import React, { useEffect,  useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Services/axiosInstance";

const ProductCategory = () => {
  const pageRender = useNavigate();  

  const category = [
    {
      cardName: "chain-card",
      cardAbs: "chain-abs",
    },
    {
      cardName: "ring-card",
      cardAbs: "ring-abs",
    },
    {
      cardName: "bracelets-card",
      cardAbs: "bracelets-abs",
    },
    {
      cardName: "earring-card",
      cardAbs: "earring-abs",
    },
  ];

  const [initialGlow, setInitialGlow] = useState(false);
  const [productCategory, setProductCategory] = useState([]);
  const [feasibilityData, setFeasibilityData] = useState([]); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [fieldValues, setFieldValues] = useState([]);

  const handleFieldChange = (value) => {
    setFieldValues([...fieldValues, value]);
  };

  const fetchClientProduct = async () => {
    setInitialGlow(true);
    const getProduct = {
      client_id: localStorage.getItem("client_id"),
    };

    try {
      const res = await axiosInstance.post(
        "/get_product_categories",
        getProduct
      );
      setInitialGlow(false);
      setProductCategory(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("client_id") !== null) {
      fetchClientProduct();
    }
  }, []);

  const redirectConsumerPreferencePage = async (id, feasibilityArray) => {
    if (feasibilityArray.length > 0) {
      setFeasibilityData(feasibilityArray);
      localStorage.setItem("product_category_id", id);
    } else {
      localStorage.setItem("product_category_id", id);
      pageRender("consumer_preference");
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < feasibilityData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered, proceed to next step
      // pageRender("consumer_preference");
    }
  };

  const handleResetAll = () => {
    setFieldValues([]);
    setCurrentQuestionIndex(0);
  };

  const dynamicInputFields = (question) => {
    switch (question.boundary_type) {
      case "in":
      case ">":
      case "<":
        return (
          <input
            type="number"
            className="w-100 form-control"
            onChange={(e) => handleFieldChange(e.target.value)}
          />
        );

      case "value":
        return (
          <select
            className="w-100 form-select"
            onChange={(e) => handleFieldChange(e.target.value)}
          >
            <option value="">select</option>
            {question.question_value.map((value, i) => (
              <option value={value} key={i}>
                {value}
              </option>
            ))}
          </select>
        );

      default:
        return <input type="text" className="w-100 form-control" />;
    }
  };

  return (
    <>
      <div className="content-breadcrumps-below-content-height w-100 placeholder-glow">
        <div className="w-100 py-4 h-100">
          <div className="card  rounded-4 border-0 category-card-height h-100 overflowY">
            <div className="card-body p-4">
              <h5 className="category-card-title">Product Category</h5>

              <div className="w-100 row g-3 pt-4">
                {initialGlow
                  ? productCategory.map((v, i) => (
                      <div className="col-12 col-sm-6 col-lg-3" key={i}>
                        <div className={`card rounded-4 cup`}>
                          <div className="card-body p-4">
                            <div className="position-relative pb-3">
                              <div className={`icon-absolute placeholder`}>
                                <img
                                  src={"..."}
                                  width={30}
                                  height={30}
                                  alt="..."
                                  className="opacity-0 pe-none"
                                />
                              </div>
                            </div>
                            <h5 className="mt-5 rounded-2 ps-1 fw-bold text-dark bg placeholder w-75 py-2"></h5>
                          </div>
                        </div>
                      </div>
                    ))
                  : productCategory.map((v, i) => (
                      <div
                        className="col-12 col-sm-6 col-lg-3"
                        key={i}
                        onClick={() => {
                          redirectConsumerPreferencePage(v.id, v.feasibility);
                          handleResetAll();
                        }}
                        data-bs-toggle={v.feasibility.length > 0 ? "modal" : ""}
                        data-bs-target={
                          v.feasibility.length > 0 ? "#feasibilityModal" : ""
                        }
                      >
                        <div
                          className={`card rounded-4 ${
                            category[i % category.length].cardName
                          } cup`}
                        >
                          <div className="card-body p-4">
                            <div className="position-relative pb-3">
                              <div
                                className={`icon-absolute ${
                                  category[i % category.length].cardAbs
                                }`}
                              >
                                <img
                                  src={`https://cdn.matsuritech.com/product/${v.name}.png`}
                                  width={30}
                                  height={30}
                                  alt="..."
                                />
                              </div>
                            </div>
                            <h5 className="pt-5 ps-1 fw-bold text-dark bg">
                              {v.name}
                            </h5>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="feasibilityModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {feasibilityData.length > 0 && (
              <div className="modal-body">
                <div className="row">
                  <div className="col-12 d-flex flex-wrap align-items-center mb-3">
                    <div className="col-7">
                      <p className="fesibility-fontSize text-break mb-0">
                        {currentQuestionIndex + 1}
                        {feasibilityData[currentQuestionIndex].question}
                      </p>
                    </div>
                    <div className="col-5">
                      {dynamicInputFields(
                        feasibilityData[currentQuestionIndex]
                      )}
                    </div>
                  </div>
                </div>

                

                
              </div>
            )}

            <div className="modal-footer">
              <div className="col-6 m-0 px-1">
                <button
                  type="button"
                  className="btn btn-transparent border w-100"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
              <div className="col-6 m-0 px-1">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={handleNextQuestion}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCategory;
