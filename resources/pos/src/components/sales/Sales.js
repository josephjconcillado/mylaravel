import React, { useEffect, useState } from "react";
import moment from "moment";
import { connect, useDispatch, useSelector } from "react-redux";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import ReactDataTable from "../../shared/table/ReactDataTable";
import { fetchSales } from "../../store/action/salesAction";
import DeleteSale from "./DeleteSale";
import {
    getFormattedDate,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import { salePdfAction } from "../../store/action/salePdfAction";
import ActionSalesButton from "../../shared/action-buttons/ActionSalesButton";
import { fetchFrontSetting } from "../../store/action/frontSettingAction";
import ShowPayment from "../../shared/showPayment/ShowPayment";
import CreatePaymentModal from "./CreatePaymentModal";
import { fetchSalePayments } from "../../store/action/salePaymentAction";
import { callSaleApi } from "../../store/action/saleApiAction";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const Sales = (props) => {
    const {
        sales,
        fetchSales,
        totalRecord,
        isLoading,
        salePdfAction,
        fetchFrontSetting,
        frontSetting,
        isCallSaleApi,
        allConfigData,
    } = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isShowPaymentModel, setIsShowPaymentModel] = useState(false);
    const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [createPaymentItem, setCreatePaymentItem] = useState({});
    const { allSalePayments } = useSelector((state) => state);

    useEffect(() => {
        fetchFrontSetting();
    }, []);

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    const onChange = (filter) => {
        fetchSales(filter, true);
    };

    //sale edit function
    const goToEdit = (item) => {
        const id = item.id;
        window.location.href = "#/app/sales/edit/" + id;
    };

    // delete sale function
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };
    const dispatch = useDispatch();

    const onShowPaymentClick = (item) => {
        setIsShowPaymentModel(!isShowPaymentModel);
        setCreatePaymentItem(item);
        if (item) {
            dispatch(fetchSalePayments(item.id));
        }
    };

    const onCreatePaymentClick = (item) => {
        setIsCreatePaymentOpen(!isCreatePaymentOpen);
        setCreatePaymentItem(item);
        if (item) {
            dispatch(fetchSalePayments(item.id));
        }
    };

    //sale details function
    const goToDetailScreen = (ProductId) => {
        window.location.href = "#/app/sales/detail/" + ProductId;
    };

    //onClick pdf function
    const onPdfClick = (id) => {
        salePdfAction(id);
    };

    const itemsValue =
        currencySymbol &&
        sales.length >= 0 &&
        sales.map((sale) => ({
            date: getFormattedDate(
                sale.attributes.date,
                allConfigData && allConfigData
            ),
            // date_for_payment: sale.attributes.date,
            time: moment(sale.attributes.created_at).format("LT"),
            reference_code: sale.attributes.reference_code,
            customer_name: sale.attributes.customer_name,
            warehouse_name: sale.attributes.warehouse_name,
            status: sale.attributes.status,
            payment_status: sale.attributes.payment_status,
            payment_type: sale.attributes.payment_type,
            grand_total: sale.attributes.grand_total,
            paid_amount: sale.attributes.paid_amount
                ? sale.attributes.paid_amount
                : (0.0).toFixed(2),
            id: sale.id,
            currency: currencySymbol,
        }));

    const columns = [
        {
            name: getFormattedMessage("dashboard.recentSales.reference.label"),
            sortField: "reference_code",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-danger">
                        <span>{row.reference_code}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("warehouse.title"),
            selector: (row) => row.warehouse_name,
            sortField: "warehouse_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("purchase.select.status.label"),
            sortField: "status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.status === 1 && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.received.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 2 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.pending.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 3 && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.ordered.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage("purchase.grant-total.label"),
            selector: (row) =>
                row.currency + " " + parseFloat(row.grand_total).toFixed(2),
            sortField: "grand_total",
            sortable: true,
        },
        {
            name: getFormattedMessage("dashboard.recentSales.paid.label"),
            selector: (row) => row.currency + " " + row.paid_amount,
            sortField: "paid_amount",
            sortable: true,
        },
        {
            name: getFormattedMessage(
                "dashboard.recentSales.paymentStatus.label"
            ),
            sortField: "payment_status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.payment_status === 1 && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.paid.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status === 2 && (
                        <span className="badge bg-light-danger">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.unpaid.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status === 3 && (
                        <span className="badge bg-light-warning">
                            {/*<span>{getFormattedMessage("payment-status.filter.unpaid.label")}</span>*/}
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.partial.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage("select.payment-type.label"),
            sortField: "payment_type",
            sortable: false,
            cell: (row) => {
                return (
                    (row.payment_type === 1 && (
                        <span className="badge bg-light-primary">
                            <span>{getFormattedMessage("cash.label")}</span>
                        </span>
                    )) ||
                    (row.payment_type === 2 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "payment-type.filter.cheque.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_type === 3 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "payment-type.filter.bank-transfer.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_type === 4 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "payment-type.filter.other.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.date,
            sortField: "date",
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-info">
                        <div className="mb-1">{row.time}</div>
                        <div>{row.date}</div>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) => (
                <ActionSalesButton
                    item={row}
                    goToEditProduct={goToEdit}
                    isEditMode={true}
                    isPdfIcon={true}
                    onClickDeleteModel={onClickDeleteModel}
                    onPdfClick={onPdfClick}
                    title={getFormattedMessage("sale.title")}
                    isPaymentShow={true}
                    isCreatePayment={true}
                    isViewIcon={true}
                    goToDetailScreen={goToDetailScreen}
                    onShowPaymentClick={onShowPaymentClick}
                    onCreatePaymentClick={onCreatePaymentClick}
                />
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("sales.title")} />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                to="#/app/sales/create"
                ButtonValue={getFormattedMessage("sale.create.title")}
                isShowPaymentModel={isShowPaymentModel}
                isCallSaleApi={isCallSaleApi}
                isShowDateRangeField
                onChange={onChange}
                totalRows={totalRecord}
                goToEdit={goToEdit}
                isLoading={isLoading}
                isShowFilterField
                isPaymentStatus
                isStatus
                isPaymentType
            />
            <DeleteSale
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
            <ShowPayment
                allConfigData={allConfigData}
                setIsShowPaymentModel={setIsShowPaymentModel}
                currencySymbol={currencySymbol}
                allSalePayments={allSalePayments}
                createPaymentItem={createPaymentItem}
                onShowPaymentClick={onShowPaymentClick}
                isShowPaymentModel={isShowPaymentModel}
            />
            <CreatePaymentModal
                setIsCreatePaymentOpen={setIsCreatePaymentOpen}
                onCreatePaymentClick={onCreatePaymentClick}
                isCreatePaymentOpen={isCreatePaymentOpen}
                createPaymentItem={createPaymentItem}
            />
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {
        sales,
        totalRecord,
        isLoading,
        frontSetting,
        isCallSaleApi,
        allConfigData,
    } = state;
    return {
        sales,
        totalRecord,
        isLoading,
        frontSetting,
        isCallSaleApi,
        allConfigData,
    };
};

export default connect(mapStateToProps, {
    fetchSales,
    salePdfAction,
    fetchFrontSetting,
})(Sales);
