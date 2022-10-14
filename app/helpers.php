<?php

use App\Models\Currency;
use App\Models\ManageStock;
use App\Models\Setting;
use App\Models\Supplier;

if (!function_exists('getPageSize')) {
    /**
     * @param $request
     *
     * @return mixed
     */
    function getPageSize($request)
    {

        return $request->input('page.size', 10);
    }
}

/**
 * @return string
 */
function getLogoUrl(): string
{

    static $appLogo;

    if (empty($appLogo)) {
        $appLogo = Setting::where('key', '=', 'logo')->first();
    }

    return asset($appLogo->logo);
}

if (!function_exists('getSettingValue')) {
    /**
     * @param $keyName
     *
     * @return mixed
     */
    function getSettingValue($keyName)
    {
        $key = 'setting'.'-'.$keyName;

        static $settingValues;

        if (isset($settingValues[$key])) {
            return $settingValues[$key];
        }

        /** @var Setting $setting */
        $setting = Setting::where('key', '=', $keyName)->first();
        $settingValues[$key] = $setting->value;

        return $setting->value;
    }
}

/**
 * @param array $models
 * @param string $columnName
 * @param int $id
 *
 * @return bool
 */
function canDelete(array $models, string $columnName, int $id): bool
{

    foreach ($models as $model) {
        $result = $model::where($columnName, $id)->exists();

        if ($result) {
            return true;
        }
    }

    return false;
}

function getCurrencyCode()
{

    $currencyId = Setting::where('key', '=', 'currency')->first()->value;

    return Currency::whereId($currencyId)->first()->symbol;
}

function getLoginUserLanguage(): string
{
    return \Illuminate\Support\Facades\Auth::user()->language;
}

if (!function_exists('manageStock')) {
    /**
     * @param $request
     *
     * @return mixed
     */
    function manageStock($warehouseID, $productID, $qty = 0)
    {
        $product = ManageStock::whereWarehouseId($warehouseID)
            ->whereProductId($productID)
            ->first();

        if ($product) {

            $totalQuantity = $product->quantity + $qty;

            if (($product->quantity + $qty) < 0) {
                $totalQuantity = 0;
            }
            $product->update([
                'quantity' => $totalQuantity,
            ]);
        } else {

            if ($qty < 0) {
                $qty = 0;
            }

            ManageStock::create([
                'warehouse_id' => $warehouseID,
                'product_id'   => $productID,
                'quantity'     => $qty,
            ]);
        }
    }
}

if (!function_exists('keyExist')) {
    function keyExist($key)
    {
        $exists = Setting::where('key', $key)->exists();

        return $exists;
    }
}


function getSupplierGrandTotalFilterIds($search)
{
    $supplierData = Supplier::with('purchases')->get();
    $ids = [];
    foreach ($supplierData as $key => $supplier) {
        $value = $supplier->purchases->sum('grand_total');
        if ($search != '') {
            if ($value == $search) {
                $ids[] = $supplier->id;
            }
        }
    }

    return $ids;
}


function getLogo()
{
    /** @var Setting $setting */
    $logoImage = Setting::where('key', '=', 'logo')->first()->value;

    $logo = base64_encode(file_get_contents($logoImage));

    return 'data:image/png;base64,'.$logo;
}
