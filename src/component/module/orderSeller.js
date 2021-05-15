import React, { useState, useEffect } from 'react'
import axiosApiInstance from '../../helper/axios'
import Image from 'next/image'
export default function OrderSeller() {
    const Url = process.env.api;
    const [state, setState] = useState({
        myOrder: {
            allItem: true,
            noPaid: false,
            getPaid: false,
            process: false,
            send: false,
            completed: false,
            orderCancel: false,
        },
        loading: false,
        isSortedByProductName: false,
        isSortedByStock: false
    })
    const [dataOrder, setDataOrder] = useState({
        dataHistoryOrder: []
    });
    useEffect(() => {
        setState({ ...state, loading: true })
        axiosApiInstance
            .get(`${Url}/v1/order/get`)
            .then((res) => {
                setDataOrder({
                    dataHistoryOrder: res.data.data,
                });
                setState({ ...state, loading: false })
            })
            .catch((err) => {
                console.log(err.response)
            });
    }, []);
    const sortByStock = () => {
        if (state.isSortedByStock) {
            const result = dataOrder.dataHistoryOrder.sort((a, b) => {
                const stockA = a.stock;
                const stockB = b.stock;
                let comparison = 0;
                if (stockA < stockB) {
                    comparison = 1;
                } else if (stockA > stockB) {
                    comparison = -1;
                }
                return comparison;
            });
            setState({
                ...state,
                isSortedByStock: false,
            });
            setDataOrder({ dataHistoryOrder: result })
            console.log(result);
        } else {
            const result = dataOrder.dataHistoryOrder.sort((a, b) => {
                const stockA = a.stock;
                const stockB = b.stock;
                let comparison = 0;
                if (stockA > stockB) {
                    comparison = 1;
                } else if (stockA < stockB) {
                    comparison = -1;
                }
                return comparison;
            });
            setState({
                ...state,
                isSortedByStock: true,
            });
            setDataOrder({...dataOrder,  dataHistoryOrder: result })
            console.log(result);
        }
    };
    return (
        <div>
            <div className="bg-white p-4 border rounded" style={{ minHeight: "550px" }}>
                <h4 className="fw-bold">My order</h4>
                <div className="d-flex my-4">
                    {/* link button */}
                    <button
                        className={
                            state.myOrder.allItem == true
                                ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                                : "bg-transparent me-4 hover-danger border-0 fw-bold"
                        }
                        onClick={() => {
                            setState({
                                ...state,
                                myOrder: {
                                    ...state.myOrder,
                                    allItem: true,
                                    noPaid: false,
                                    getPaid: false,
                                    send: false,
                                    completed: false,
                                    orderCancel: false,
                                    process: false
                                },
                            });
                        }}
                    >
                        All items
                                </button>
                    <button
                        className={
                            state.myOrder.getPaid == true
                                ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                                : "bg-transparent me-4 hover-danger border-0 fw-bold"
                        }
                        onClick={() => {
                            setState({
                                ...state,
                                myOrder: {
                                    ...state.myOrder,
                                    allItem: false,
                                    noPaid: false,
                                    getPaid: true,
                                    send: false,
                                    completed: false,
                                    orderCancel: false,
                                    process: false
                                },
                            });
                        }}
                    >
                        get Paid
                                </button>
                    <button
                        className={
                            state.myOrder.process == true
                                ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                                : "bg-transparent me-4 hover-danger border-0 fw-bold"
                        }
                        onClick={() => {
                            setState({
                                ...state,
                                myOrder: {
                                    ...state.myOrder,
                                    allItem: false,
                                    noPaid: false,
                                    getPaid: false,
                                    send: false,
                                    completed: false,
                                    orderCancel: false,
                                    process: true
                                },
                            });
                        }}
                    >
                        processed
                                </button>
                    <button
                        className={
                            state.myOrder.send == true
                                ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                                : "bg-transparent me-4 hover-danger border-0 fw-bold"
                        }
                        onClick={() => {
                            setState({
                                ...state,
                                myOrder: {
                                    ...state.myOrder,
                                    allItem: false,
                                    noPaid: false,
                                    getPaid: false,
                                    send: true,
                                    completed: false,
                                    orderCancel: false,
                                    process: false
                                },
                            });
                        }}
                    >
                        Sent
                                </button>
                    <button
                        className={
                            state.myOrder.completed == true
                                ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                                : "bg-transparent me-4 hover-danger border-0 fw-bold"
                        }
                        onClick={() => {
                            setState({
                                ...state,
                                myOrder: {
                                    ...state.myOrder,
                                    allItem: false,
                                    noPaid: false,
                                    getPaid: false,
                                    send: false,
                                    completed: true,
                                    orderCancel: false,
                                    process: false
                                },
                            });
                        }}
                    >
                        Completed
                                </button>
                    <button
                        className={
                            state.myOrder.orderCancel == true
                                ? "bg-transparent me-4 hover-danger border-0 fw-bold text-danger"
                                : "bg-transparent me-4 hover-danger border-0 fw-bold"
                        }
                        onClick={() => {
                            setState({
                                ...state,
                                myOrder: {
                                    ...state.myOrder,
                                    allItem: false,
                                    noPaid: false,
                                    getPaid: false,
                                    send: false,
                                    completed: false,
                                    orderCancel: true,
                                    process: false
                                },
                            });
                        }}
                    >
                        Order cancel
                            </button>
                    {/*  */}
                </div>
                <div className="w-100 h-100">
                    {/* search box */}
                    <div className="d-flex rounded-pill border p-2 mb-4" style={{ width: "300px" }}>
                        <span className="material-icons color-gray me-2">search</span>
                        <input
                            type="text"
                            className="border-0 w-100 my-auto"
                            style={{ outline: "none" }}
                            placeholder="search..."
                            disabled
                        />
                    </div>
                    {/*  */}
                    <div style={{overflow:"auto"}}>
                    <div style={{minWidth:"670px"}}>
                        <div style={{ background: "#F6F6F6" }}>
                            <div className="row">
                                <div className="col-4">
                                    <div className="c-pointer px-2 px-lg-4 py-3 d-flex justify-content-center hover-bg-gray">
                                        <p className="m-0 me-3">Product name</p>
                                        <span className="material-icons">sort</span>
                                    </div>
                                </div>
                                <div className="col-1 col-sm-2 ms-auto">
                                    <div className="c-pointer px-2 px-lg-4 py-3 d-flex justify-content-center hover-bg-gray">
                                        <p className="m-0 me-3">Stock</p>
                                        <span className="material-icons">sort</span>
                                    </div>
                                </div>
                                <div className="col-1 col-sm-2 ms-auto">
                                    <div className="pe-4 px-lg-4 py-3 ms-auto text-center">
                                        <span>status</span>
                                    </div>
                                </div>
                                <div className={state.myOrder.getPaid === true || state.myOrder.send === true || state.myOrder.completed === true || state.myOrder.orderCancel === true ? "hide" : "col-2 ms-auto pe-4 py-3 ms-auto text-center"}>
                                    <div>
                                        <span>action</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {state.loading ?
                            <div className="d-flex flex-column align-items-center justify-content-center bg-white p-4 border rounded " style={{ minHeight: "300px" }}>
                                <div className="spinner-grow text-danger mb-3" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <h3 className="fw-bold">Wait a moment...</h3>
                            </div>
                            :
                            <div>
                                <div className={state.myOrder.allItem === true ? "justify-content-center overflow-auto" : "hide"} style={{ maxHeight: "300px" }}>
                                    {dataOrder.dataHistoryOrder.map((item) => {
                                        return (
                                            <div className="row  hover-bg-gray border-top  justify-content-between" style={{ background: "#F6F6F6" }}>
                                                <div className="col-4 py-2 my-auto">
                                                    <span
                                                        className="d-inline-block text-truncate text-table-responsive text-center ps-4"
                                                    >
                                                        {item.nameProduct}
                                                    </span>
                                                </div>
                                                <div className="col-2 ms-auto pe-4">
                                                    <p className="py-2 m-0 ms-auto my-auto text-center">
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                                <div className="col-2 ms-auto">
                                                    <p className="py-2 m-0 ms-auto my-auto text-center">
                                                        {item.status}
                                                    </p>
                                                </div>
                                                <div className="col-2 ms-auto my-auto">
                                                    <button
                                                        className="border-primary bg-transparent rounded-pill text-primary px-3 py-1"
                                                        disabled={item.status == "completed" || item.status == "cancelled" || item.status == "pending" ? true : false}
                                                        onClick={(e) => {
                                                            swal({
                                                                title: "anda yakin?",
                                                                text: "status akan diubah",
                                                                icon: "warning",
                                                                dangerMode: true,
                                                            }).then((willDelete) => {
                                                                if (willDelete) {
                                                                    axiosApiInstance
                                                                        .put(`${Url}/v1/order`, {
                                                                            status: "completed",
                                                                            orderId: item.orderId,
                                                                        })
                                                                        .then((res) => {
                                                                            swal(
                                                                                "updated!",
                                                                                "data updated",
                                                                                "success"
                                                                            );
                                                                            axiosApiInstance
                                                                                .get(`${Url}/v1/order/get`)
                                                                                .then((res) => {
                                                                                    setDataOrder({
                                                                                        dataHistoryOrder: res.data.data,
                                                                                    });
                                                                                })
                                                                                .catch((err) => { });
                                                                        })
                                                                        .catch((err) => {
                                                                            swal("err", err.response, "error");
                                                                        });
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        done
                                                        </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {/* gambar */}
                                    <div
                                        className={
                                            dataOrder.dataHistoryOrder.length === 0 ? "show" : "hide"
                                        }
                                    >
                                        <div
                                            className="d-flex justify-content-center"
                                            style={{ height: "300px" }}
                                        >
                                            <div
                                                className="my-auto"
                                                style={{ width: "224px", height: "177px" }}
                                            >
                                                <Image
                                                    src="/img/data_null.png"
                                                    width={224}
                                                    height={177}
                                                    layout="responsive"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* --- */}
                                </div>
                                <div className={state.myOrder.getPaid === true ? "w-100 justify-content-center overflow-auto" : "hide"} style={{ maxHeight: "300px" }}>
                                    {dataOrder.dataHistoryOrder.map((item) => {
                                        if (item.status === "pending") {
                                            return (
                                                <div className="d-flex  hover-bg-gray border-top  justify-content-between w-100" style={{ background: "#F6F6F6" }}>
                                                    <div className="py-2 ps-4 my-auto" style={{ width: "60%" }}>
                                                        <span
                                                            className="d-inline-block text-truncate"
                                                            style={{ maxWidth: "250px" }}
                                                        >
                                                            {item.nameProduct}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex pe-4" style={{ width: "40%" }}>
                                                        <p className="py-2 m-0 ms-auto my-auto px-4">
                                                            {item.quantity}
                                                        </p>
                                                        <p className="py-2 m-0 ms-auto my-auto px-4">
                                                            {item.status}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                                <div className={state.myOrder.process === true ? "w-100 justify-content-center overflow-auto" : "hide"} style={{ maxHeight: "300px" }}>
                                    {dataOrder.dataHistoryOrder.map((item) => {
                                        if (item.status === "process") {
                                            return (
                                                <div className="row  hover-bg-gray border-top  justify-content-between" style={{ background: "#F6F6F6" }}>
                                                    <div className="col-4 py-2 my-auto">
                                                        <span
                                                            className="d-inline-block text-truncate text-table-responsive text-center ps-4"
                                                        >
                                                            {item.nameProduct}
                                                        </span>
                                                    </div>
                                                    <div className="col-2 ms-auto pe-4">
                                                        <p className="py-2 m-0 ms-auto my-auto text-center">
                                                            {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="col-2 ms-auto">
                                                        <p className="py-2 m-0 ms-auto my-auto text-center">
                                                            {item.status}
                                                        </p>
                                                    </div>
                                                    <div className="col-2 ms-auto my-auto">
                                                        <button
                                                            className="border-primary bg-transparent rounded-pill text-primary px-3 py-1"
                                                            disabled={item.status == "completed" || item.status == "cancelled" || item.status == "pending" ? true : false}
                                                            onClick={(e) => {
                                                                swal({
                                                                    title: "anda yakin?",
                                                                    text: "status akan diubah",
                                                                    icon: "warning",
                                                                    dangerMode: true,
                                                                }).then((willDelete) => {
                                                                    if (willDelete) {
                                                                        axiosApiInstance
                                                                            .put(`${Url}/v1/order`, {
                                                                                status: "completed",
                                                                                orderId: item.orderId,
                                                                            })
                                                                            .then((res) => {
                                                                                swal(
                                                                                    "updated!",
                                                                                    "data updated",
                                                                                    "success"
                                                                                );
                                                                                axiosApiInstance
                                                                                    .get(`${Url}/v1/order/get`)
                                                                                    .then((res) => {
                                                                                        setDataOrder({
                                                                                            dataHistoryOrder: res.data.data,
                                                                                        });
                                                                                    })
                                                                                    .catch((err) => { });
                                                                            })
                                                                            .catch((err) => {
                                                                                swal("err", err.response, "error");
                                                                            });
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            done
                                                            </button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                                <div className={state.myOrder.send === true ? "w-100 justify-content-center overflow-auto" : "hide"} style={{ maxHeight: "300px" }}>
                                    {dataOrder.dataHistoryOrder.map((item) => {
                                        if (item.status === "sending") {
                                            return (
                                                <div className="d-flex  hover-bg-gray border-top  justify-content-between w-100" style={{ background: "#F6F6F6" }}>
                                                    <div className="py-2 ps-4 my-auto" style={{ width: "60%" }}>
                                                        <span
                                                            className="d-inline-block text-truncate"
                                                            style={{ maxWidth: "250px" }}
                                                        >
                                                            {item.nameProduct}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex pe-4" style={{ width: "40%" }}>
                                                        <p className="py-2 m-0 ms-auto my-auto px-4">
                                                            {item.quantity}
                                                        </p>
                                                        <p className="py-2 m-0 ms-auto my-auto px-4">
                                                            {item.status}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                                <div className={state.myOrder.completed === true ? "w-100 justify-content-center overflow-auto" : "hide"} style={{ maxHeight: "300px" }}>
                                    {dataOrder.dataHistoryOrder.map((item) => {
                                        if (item.status === "completed") {
                                            return (
                                                <div className="d-flex  hover-bg-gray border-top  justify-content-between w-100" style={{ background: "#F6F6F6" }}>
                                                    <div className="py-2 ps-4 my-auto" style={{ width: "60%" }}>
                                                        <span
                                                            className="d-inline-block text-truncate"
                                                            style={{ maxWidth: "250px" }}
                                                        >
                                                            {item.nameProduct}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex pe-4" style={{ width: "40%" }}>
                                                        <p className="py-2 m-0 ms-auto my-auto px-4">
                                                            {item.quantity}
                                                        </p>
                                                        <p className="py-2 m-0 ms-auto my-auto px-4">
                                                            {item.status}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                                <div className={state.myOrder.orderCancel === true ? "w-100 justify-content-center overflow-auto" : "hide"} style={{ maxHeight: "300px" }}>
                                    {dataOrder.dataHistoryOrder.map((item) => {
                                        if (item.status === "cancelled") {
                                            return (
                                                <div className="d-flex  hover-bg-gray border-top  justify-content-between w-100" style={{ background: "#F6F6F6" }}>
                                                    <div className="py-2 ps-4 my-auto" style={{ width: "60%" }}>
                                                        <span
                                                            className="d-inline-block text-truncate"
                                                            style={{ maxWidth: "250px" }}
                                                        >
                                                            {item.nameProduct}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex pe-4" style={{ width: "40%" }}>
                                                        <p className="py-2 m-0 ms-auto my-auto px-4">
                                                            {item.quantity}
                                                        </p>
                                                        <p className="py-2 m-0 ms-auto my-auto px-4">
                                                            {item.status}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        }
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
