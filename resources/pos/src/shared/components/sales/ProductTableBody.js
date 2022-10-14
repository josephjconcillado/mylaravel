import React, {useEffect, useState} from 'react';
import {InputGroup} from 'react-bootstrap-v5';
import {connect} from 'react-redux';
import Form from 'react-bootstrap/Form';
import {
    taxAmountMultiply, discountAmountMultiply, subTotalCount, amountBeforeTax
} from '../../calculation/calculation';
import ProductModal from './ProductModal';
import {productSalesDropdown} from '../../../store/action/productSaleUnitAction';
import {decimalValidate, numValidate} from '../../sharedMethod';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPencil, faTrash} from '@fortawesome/free-solid-svg-icons';

const ProductTableBody = (props) => {
    const {
        singleProduct,
        index,
        updateProducts,
        setUpdateProducts,
        productSales,
        productSalesDropdown,
        updateCost,
        updateDiscount,
        updateTax,
        updateSubTotal,
        updateSaleUnit, frontSetting
    } = props;
    const [isShowModal, setIsShowModal] = useState(false);
    const [updateProductData, setUpdateProductData] = useState([]);

    useEffect(() => {
        singleProduct.newItem !== '' && productSalesDropdown(singleProduct.product_unit)
    }, [updateProductData, singleProduct.sale_unit]);

    useEffect(() => {
        singleProduct.sub_total = Number(subTotalCount(singleProduct))
    }, [singleProduct.sub_total]);

    const onProductUpdateInCart = (item) => {
        setUpdateProductData(item);
    };

    const onDeleteCartItem = (id) => {
        const newProduct = updateProducts.filter((item) => item.id !== id);
        setUpdateProducts(newProduct);
    };

    const handleIncrement = () => {
        setUpdateProducts(updateProducts => updateProducts.map(item => item.id === singleProduct.id
            ? {...item, quantity: item.quantity++ + 1}
            : item,
        ))
    };

    const handleDecrement = () => {
        if (singleProduct.quantity - 1 > 0) {
            setUpdateProducts(updateProducts => updateProducts.map(item => item.id === singleProduct.id
                ? {...item, quantity: item.quantity --- 1}
                : item,
            ))
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        const {value} = e.target;
        // check if value includes a decimal point
        if (value.match(/\./g)) {
            const [, decimal] = value.split('.');
            // restrict value to only 2 decimal places
            if (decimal?.length > 2) {
                // do nothing
                return;
            }
        }
        setUpdateProducts(updateProducts => updateProducts.map(item => item.id === singleProduct.id
            ? {...item, quantity: Number(value)}
            : item,
        ))
    };

    const onClickShowProductModal = () => {
        setIsShowModal(true);
        productSalesDropdown(singleProduct.product_unit)
    };

    return (
        <tr key={index} className='align-middle'>
            <td>
                <h4 className='product-name'>{singleProduct.code}</h4>
                <div className='d-flex align-items-center'>
                    <span className='badge bg-light-success'>
                    <span>{singleProduct.name}</span>
                </span>
                    <span className='badge bg-light-primary p-1 ms-1'>
                    <FontAwesomeIcon icon={faPencil} onClick={(e) => onClickShowProductModal(e)}
                                     style={{cursor: 'pointer'}}/>
                    </span>
                </div>
                {isShowModal && <ProductModal product={singleProduct} isShowModal={isShowModal}
                                              frontSetting={frontSetting} updateSubTotal={updateSubTotal}
                                              setIsShowModal={setIsShowModal} updateCost={updateCost}
                                              updateDiscount={updateDiscount} updateTax={updateTax}
                                              productSales={productSales} updateSaleUnit={updateSaleUnit}
                                              onProductUpdateInCart={onProductUpdateInCart}/>}
            </td>
            <td>{frontSetting.value && frontSetting.value.currency_symbol} {amountBeforeTax(singleProduct).toFixed(2)}</td>
            <td>
            {singleProduct.isEdit ? 
                singleProduct.stock.length >= 1 && singleProduct.stock.map((item) => {
                    return(
                        <span className='badge bg-light-warning'>
                        <span>{item.quantity}&nbsp;{singleProduct.short_name}</span>
                        </span>
                    )
                })
                :
                singleProduct.stock >= 0 ? <span className='badge bg-light-warning'>
                    <span>{singleProduct.stock}&nbsp;{singleProduct.short_name}</span>
                </span>
                :
                ''}
            </td>
            <td>
                <div className='custom-qty'>
                    <InputGroup>
                        <InputGroup.Text className='btn btn-primary btn-sm px-4 px-4 pt-2'
                                         onClick={(e) => handleDecrement(e)}>
                            -
                        </InputGroup.Text>
                        <Form.Control aria-label='Product Quantity'
                                      onKeyPress={(event) => decimalValidate(event)}
                                      className='text-center px-0 py-2 rounded-0 hide-arrow'
                                      value={singleProduct.quantity}
                                      type="number"
                                      step={0.01}
                                      min={0.00}
                                      onChange={(e) => handleChange(e)}
                        />
                        <InputGroup.Text className='btn btn-primary btn-sm px-4 px-4 pt-2'
                                         onClick={(e) => handleIncrement(e)}>
                            +
                        </InputGroup.Text>
                    </InputGroup>
                </div>
            </td>
            <td>{frontSetting.value && frontSetting.value.currency_symbol} {discountAmountMultiply(singleProduct)}</td>
            <td>{frontSetting.value && frontSetting.value.currency_symbol} {taxAmountMultiply(singleProduct)}</td>
            <td>{frontSetting.value && frontSetting.value.currency_symbol} {subTotalCount(singleProduct)}</td>
            <td className='text-start'>
                <button className='btn px-2 text-danger fs-3'>
                    <FontAwesomeIcon icon={faTrash} onClick={() => onDeleteCartItem(singleProduct.id)}/>
                </button>
            </td>
        </tr>
    )
};

const mapStateToProps = (state) => {
    const {productSales} = state;
    return {productSales};
};

export default connect(mapStateToProps, {productSalesDropdown})(ProductTableBody);
