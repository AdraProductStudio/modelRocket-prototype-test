import React, { useContext, useEffect, useRef, useState } from "react";
import axiosInstance from "../../Services/axiosInstance";
import { DataAnalysisGrapgh } from "./DataAnalysisGrapgh";
import Slider from "react-slick";
import { Tooltip } from "react-tooltip";
import { FaInfoCircle } from "react-icons/fa";
import ConsumerPreferenceChatbotLayout from "./ConsumerPreferenceChatbotLayout";
import CommonContext from "../CommonContext";
import toast from "react-hot-toast";

const ConsumerPreferenceLayout = () => {
  const { productViewType } = useContext(CommonContext);

  const [initialGlow, setInitialGlow] = useState(false);
  const dummySlider = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const [sliderIndex, setSliderIndex] = useState(0); // Track slider index
  const [viewCharts, setViewCharts] = useState(false);
  const [viewGraph, setViewGraph] = useState(false);

  const [mainCriteriaPairs, setMainCriteriaPairs] = useState([]);
  const [sliderValues, setSliderValues] = useState([]);
  let sliderRef = useRef(null);

  const [apiRequest, setApiRequest] = useState({});
  const [productComparison, setProductComparison] = useState([]);
  const [showGraphSection, setShowGraphSection] = useState(false);

  useEffect(() => {
    setInitialGlow(true);
    const get_attributes = async () => {
      const getProduct = {
        client_id: localStorage.getItem("client_id"),
        product_id: localStorage.getItem("product_id"),
        service_id: localStorage.getItem("service_id"),
      };

      try {
        await axiosInstance.post("/get_attributes", getProduct).then((res) => {
          setInitialGlow(false);
          setApiRequest(res.data.data);
          setMainCriteriaPairs(res.data.data.main_criteria_pairs);

          var props = {
            client_id: localStorage.getItem("client_id"),
            product_category_id: localStorage.getItem("product_id"),
            requestData: res.data.data,
          };

          handleDone(props);
        });
      } catch (error) {
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.msg === "Token has expired"
        ) {
          return "Session Expired! Please try again...!";        
        }
      }
    };

    if (
      localStorage.getItem("client_id") !== null &&
      localStorage.getItem("product_id")
    ) {
      get_attributes();
    }
  }, []);

  useEffect(() => {
    if (mainCriteriaPairs.length > 0) {
      const defaultValues = Array(mainCriteriaPairs.length).fill(5);
      setSliderValues(defaultValues);
    }
  }, [mainCriteriaPairs]);

  const convertSliderValue = (value) => {
    switch (value) {
      case 1:
        return 5;
      case 2:
        return 4;
      case 3:
        return 3;
      case 4:
        return 2;
      case 5:
        return 1;
      case 6:
        return 1 / 2;
      case 7:
        return 1 / 3;
      case 8:
        return 1 / 4;
      case 9:
        return 1 / 5;
      default:
        return 1;
    }
  };

  const handleSliderChange = (index, value) => {
    // Create a copy of the current slider values
    const newSliderValues = [...sliderValues];

    // Update the value of the slider at the specified index
    newSliderValues[index] = value;

    // Update the state with the new slider values
    setSliderValues(newSliderValues);

    if (index >= Math.floor(mainCriteriaPairs.length / 2)) {
      setShowGraphSection(true); // Show the graph section
    }
  };

  const [graphData, setGraphData] = useState({});

  const handleDone = async (params) => {
    var updatedApiRequest = {};
    if (
      params.client_id === undefined &&
      params.product_category_id === undefined
    ) {
      updatedApiRequest = {
        ...apiRequest,
        user_importance: sliderValues.map(convertSliderValue),
        filters: { criteria: "", condition: "", value1: "", value2: "" },
      };

     
    } else {
      const defaultValuesSetting = Array(
        params.requestData.main_criteria_pairs.length
      ).fill(1);
      updatedApiRequest = {
        ...params.requestData,
        user_importance: defaultValuesSetting,
        filters: { criteria: "", condition: "", value1: "", value2: "" },
      };
    }

    try {
      const response = await axiosInstance.post(
        "/consumer_service",
        updatedApiRequest
      );

      if (response.data.error_code === 200) {
        setProductComparison(response.data.data.product_comparisons);
        setGraphData(response.data.data.criteria_weights);
        next();
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.msg === "Token has expired"
      ) {        
        toast.error("Session Expired! Please try again...!");        
      }
    }
  };

  const handleReset = async () => {
    setSliderIndex(0);
    setShowGraphSection(false);
    setViewCharts(false);
    setViewGraph(false);

    if (mainCriteriaPairs.length > 0) {
      const defaultValues = Array(mainCriteriaPairs.length).fill(5); // Assuming default value is 5
      setSliderValues(defaultValues);
    }

    const updatedApiRequest = {
      ...apiRequest,
      user_importance: Array(mainCriteriaPairs.length)
        .fill(5)
        .map(convertSliderValue),
      filters: { criteria: "", condition: "", value1: "", value2: "" },
    };

    try {
      const response = await axiosInstance.post(
        "/consumer_service",
        updatedApiRequest
      );

      if (response.data.error_code === 200) {
        setProductComparison(response.data.data.product_comparisons);
        setGraphData(response.data.data.criteria_weights);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sliderKey = `slider-${sliderIndex}`;

  const next = () => {
    if (mainCriteriaPairs.length / 2 <= sliderIndex) {
      setShowGraphSection(true);
    }
    sliderRef.slickNext();
  };

  const settings = {
    key: sliderKey,
    draggable: false,
    swipeToSlide: false,
    touchMove: false,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: sliderIndex, // Use sliderIndex directly
    afterChange: (index) => setSliderIndex(index), // Update slider index
  };

  return (
    <>
      {productViewType.test === "Slider" ? (
        <section className="content-breadcrumps-below-content-height content-preference-section pt-1 overflowY overflowX placeholder-glow">
          <div className="container h-100">
            <div className="row h-100">
              {/* Left-side container */}

              <div className="col-lg-6 h-100 ps-0 pe-2 py-3">
                <div className=" card border-0 shadow-sm h-100 rounded-4">
                  <div className="row align-items-center">
                    <div className="col">
                      <h4 className="card-title mb-1 pt-4 pb-3 px-4">
                        Consumer preference
                        <Tooltip id="tooltip_one" className="tooltipWidth" />
                        <label className="form-label ps-2">
                          {" "}
                          <FaInfoCircle
                            data-tooltip-id="tooltip_one"
                            data-tooltip-content="This is a representation of the consumer engagement"
                          />{" "}
                        </label>
                      </h4>
                      <label className="form-label mx-4">
                        Please use the slider to indicate which of the following
                        two attributes is more important to you
                      </label>
                    </div>
                  </div>

                  <div className="range-bar-container slidecontainer  px-4">
                    <>
                      {initialGlow ? (
                        dummySlider.map((v, i) => {
                          return (
                            <div
                              className="d-flex h-100 my-4 align-items-center"
                              key={i}
                            >
                              <p className="p-2 mb-0 w-25 sliderText py-2 rounded-1 placeholder mx-4"></p>
                              <div className="p-2 mb-0 flex-grow-1">
                                <input
                                  type="range"
                                  className="form-control slider w-100 placeholder pe-none"
                                  min="1"
                                  max="9"
                                  step="5"
                                />
                              </div>
                              <p className="p-2 mb-0 w-25 sliderText py-2 rounded-1 placeholder mx-4">
                                {" "}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="row h-100 justify-content-center align-items-center px-3 ">
                          <Slider
                            ref={(slider) => {
                              sliderRef = slider;
                            }}
                            {...settings}
                          >
                            {mainCriteriaPairs.map((pair, index) => (
                              <div
                                key={index}
                                className="d-flex flex-wrap align-items-center text-center w-100"
                              >
                                <p className="col p-2 mb-0 sliderText text-break">
                                  {pair[0]}
                                </p>
                                <div className="col-5 p-2 mb-0 flex-grow-1">
                                  <input
                                    type="range"
                                    className="form-control slider"
                                    min="1"
                                    max="9"
                                    step="1"
                                    value={sliderValues[index] || 5}
                                    onChange={(event) =>
                                      handleSliderChange(
                                        index,
                                        parseInt(event.target.value)
                                      )
                                    }
                                  />
                                </div>
                                <p className="col py-2 px-0 mb-0 sliderText text-break">
                                  {pair[1]}
                                </p>
                              </div>
                            ))}
                          </Slider>
                        </div>
                      )}
                    </>
                  </div>

                  <div className="d-flex justify-content-evenly px-4 my-2 mx-2">
                    <div
                      className="btn btn-secondary  w-100 mx-1"
                      onClick={handleReset}
                    >
                      Reset
                    </div>

                    <button
                      type="button"
                      className="btn brand-color w-100 fw-bold"
                      onClick={handleDone}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Right-side container */}

              <div className="col-lg-6 h-100 pe-0 ps-2 py-3">
                <div className="card h-100 border-0 shadow-sm rounded-4 d-flex flex-wrap p-2">
                  {/* secion one  */}
                  <div className="h-50">
                    <div className="card h-100 overflowY">
                      <h6 className="card-title m-2">
                        Consumer weights
                        <Tooltip id="tooltip_two" className="tooltipWidth" />
                        <label className="form-label ps-2">
                          {" "}
                          <FaInfoCircle
                            data-tooltip-id="tooltip_two"
                            data-tooltip-content="This is a view into the consumer's weights"
                          />{" "}
                        </label>
                      </h6>

                      <div className="card-body">
                        {viewCharts ? (
                          Object.keys(graphData).length > 0 ? (
                            <DataAnalysisGrapgh graphData={graphData} />
                          ) : null
                        ) : (
                          <div className="h-100 row align-items-center justify-content-center">
                            <div className="col text-center">
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setViewCharts(true)}
                              >
                                View consumer weights
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* secion two  */}
                  <div className="h-50">
                    <div className="card h-100 overflowY overflowX">
                      {viewGraph ? (
                        <>
                          <div>
                            <h4 className="card-title mb-1 pt-4 mb-3 px-2">
                              Top Recommendations
                              <Tooltip
                                id="tooltip_three"
                                className="tooltipWidth"
                              />
                              <label className="form-label ps-2">
                                {" "}
                                <FaInfoCircle
                                  data-tooltip-id="tooltip_three"
                                  data-tooltip-content="This is a view into the recommendations made to the consumer and the rationale behind it"
                                />{" "}
                              </label>
                            </h4>
                          </div>
                          <h6 className="m-2 recommendations-content">
                            Options from the catalog that best match the
                            consumer preference weights will be displayed here.
                            The following are the consumer weights sorted by
                            priority in descending order.
                          </h6>
                          <div className="row mx-0 my-3 flex-column">
                            {Object.keys(graphData)
                              // Sort keys based on values in descending order
                              .sort((a, b) => graphData[b] - graphData[a])
                              .map((key, index) => (
                                <div
                                  className="col mb-3 price-container"
                                  key={index}
                                >
                                  <div className="form-floating">
                                    <input
                                      type="text"
                                      className="w-100 pt-3 px-3 price-input-field pe-none"
                                      value={(graphData[key] * 100).toFixed(2)}
                                      readOnly
                                    />
                                    <p className="special-label">{key} (%)</p>
                                  </div>
                                </div>
                              ))}
                          </div>

                          {productComparison.length > 0 ? (
                            <div>
                              <div className="top-recommendation-card-container px-4">
                                {productComparison.map((item, index) => (
                                  <div className="card mb-3 p-0" key={index}>
                                    <div className="row g-0">
                                      <div className="col-md-12">
                                        <div className="card-body mb-0">
                                          <h5 className="card-title fw-bold">
                                            {item.name}
                                          </h5>
                                          <p className="card-text">
                                            {item.desc}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="container-fluid my-3 mb-4">
                                      <div className="row mx-0">
                                        {/* Mapping non-quantified values into item.features */}
                                        {item["non-quantified-values"].map(
                                          (feature, index) => {
                                            // Get the label and value from each feature object
                                            const label =
                                              Object.keys(feature)[0]; // Extracting the label
                                            const value = feature[label]; // Extracting the value

                                            // Calculate the width of the column dynamically based on the length of the label and value
                                            const labelWidth = `${
                                              (label.length + 2) * 10
                                            }px`; // Adjust the multiplier according to your font size and padding
                                            const valueWidth = `${
                                              (value.length + 2) * 10
                                            }px`; // Adjust the multiplier according to your font size and padding
                                            const columnWidth =
                                              label.length > value.length
                                                ? labelWidth
                                                : valueWidth;

                                            // Rendering JSX for each feature
                                            return (
                                              <div
                                                className="col mb-3 price-container"
                                                key={index}
                                                style={{
                                                  minWidth: columnWidth,
                                                }}
                                              >
                                                <div className="form-floating">
                                                  <input
                                                    type="text"
                                                    className="w-100 pt-3 px-3 price-input-field pe-none"
                                                    value={value}
                                                    readOnly
                                                  />
                                                  <p className="special-label">
                                                    {label}
                                                  </p>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : showGraphSection ? (
                        <div className="h-100 row align-items-center justify-content-center">
                          <div className="col text-center">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => setViewGraph(true)}
                            >
                              View recommendations
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <ConsumerPreferenceChatbotLayout />
      )}
    </>
  );
};

export default ConsumerPreferenceLayout;
