<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>{{ __('messages.quotation_pdf') }}</title>
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon.ico') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Fonts -->
    <!-- General CSS Files -->
    <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css"/>
    <style>
        * {
            font-family: DejaVu Sans, Arial, "Helvetica", Arial, "Liberation Sans", sans-serif;
        }

        @if(getLoginUserLanguage() !='ar')
            .fw-bold {
            font-weight: 500;
            color: #333;
        }

        @else
        .fw-bold {
            /*font-weight: 500;*/
            color: #333;
        }

        @endif

        .fw-light {
            font-weight: 500;
            color: grey;
        }
    </style>

</head>
<body>

<table width="100%">
    <tr>
        <td>
            <img src="{{getLogo()}}" alt="Company Logo" width="80px">
        </td>
        <td align="center" style="vertical-align: bottom">
            <h2 style="color: dodgerblue;">{{ $quotation->reference_code }}</h2>
        </td>
        <td width="30%" style="line-height: 5px;">
            <h4 class="fw-bold">{{ __('messages.pdf.date') }}: <span
                        class="fw-light">{{ \Carbon\Carbon::parse($quotation->created_at)->format('Y-m-d') }}</span>
            </h4>
            <h4 class="fw-bold">{{ __('messages.pdf.number') }}: <span
                        class="fw-light">{{ $quotation->reference_code }}</span></h4>
            <h4 class="fw-bold">{{ __('messages.pdf.status') }}: <span
                        class="fw-light">{{ $quotation->status == \App\Models\Quotation::SENT ? 'Sent' : 'Pending' }}</span>
            </h4>
        </td>
    </tr>
</table>
<table width="100%" style="margin-top: 40px;">
    <tr style="vertical-align: top;">
        <td style="width: 50%;">
            <table width="95%" cellpadding="0">
                <tr style="background-color: dodgerblue;">
                    <td style="color: #fff;padding: 10px;font-size: 18px;">{{ __('messages.pdf.customer_info') }}</td>
                </tr>
                <tr style="background-color: #f5f3f3;">
                    <td style="padding: 10px;">
                        <p class="fw-bold">{{ __('messages.pdf.name') }}: <span
                                    class="fw-light">{{ isset($quotation->customer->name) ? $quotation->customer->name : 'N/A' }}</span>
                        </p>
                        <p class="fw-bold">{{ __('messages.pdf.phone') }}: <span
                                    class="fw-light">{{ isset($quotation->customer->phone) ? $quotation->customer->phone : 'N/A' }}</span>
                        </p>
                        <p class="fw-bold">{{ __('messages.pdf.address') }}: <span class="fw-light">
                                {{ isset($quotation->customer->address) ? $quotation->customer->address : '' }}
                                {{ isset($quotation->customer->city) ? $quotation->customer->city : '' }}
                                {{ isset($quotation->customer->country) ? $quotation->customer->country : '' }}
                            </span></p>
                        <p class="fw-bold">{{ __('messages.pdf.email') }}: <span
                                    class="fw-light">{{ isset($quotation->customer->email) ? $quotation->customer->email : ''}}</span>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
        <td style="width: 50%;">
            <table width="95%" align="right">
                <tr style="background-color: dodgerblue;">
                    <td style="color: #fff;padding: 10px;font-size: 18px;">{{ __('messages.pdf.company_info') }}</td>
                </tr>
                <tr style="background-color: #f5f3f3;">
                    <td style="padding: 10px;">
                        <h3 style="color: #333;">{{ getSettingValue('company_name') }}</h3>
                        <p class="fw-bold">{{ __('messages.pdf.address') }}: <span
                                    class="fw-light">{{ getSettingValue('address') }}</span></p>
                        <p class="fw-bold">{{ __('messages.pdf.phone') }}: <span
                                    class="fw-light">{{ getSettingValue('phone') }}</span></p>
                        <p class="fw-bold">{{ __('messages.pdf.email') }}: <span
                                    class="fw-light">{{ getSettingValue('email') }}</span></p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
    <thead>
    <tr style="background-color: dodgerblue;">
        <th style="color: #fff;">{{ __('messages.pdf.product') }}</th>
        <th style="color: #fff;">{{ __('messages.pdf.unit_price') }}</th>
        <th style="color: #fff;">{{ __('messages.pdf.quantity') }}</th>
        <th style="color: #fff;">{{ __('messages.heading_discount') }}</th>
        <th style="color: #fff;">{{ __('messages.pdf.tax') }}</th>
        <th style="color: #fff;">{{ __('messages.heading_total') }}</th>
    </tr>
    </thead>
    <tbody style="background-color: #f5f3f3;">
    @foreach($quotation->quotationItems  as $quotationItem)
        <tr align="center">
            <td>{{$quotationItem->product->name}}</td>
            <td>{{getCurrencyCode()}} {{ number_format((float)$quotationItem->net_unit_price, 2)}}</td>
            <td>{{$quotationItem->quantity}}</td>
            <td>{{getCurrencyCode()}} {{ number_format((float)$quotationItem->discount_amount, 2)}}</td>
            <td>{{getCurrencyCode()}} {{ number_format((float)$quotationItem->tax_amount, 2)}}</td>
            <td>{{getCurrencyCode()}} {{ number_format((float)$quotationItem->sub_total, 2)}}</td>
        </tr>
    @endforeach
    </tbody>
</table>
<table width="40%" align="right" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
    <tbody style="background-color: #f5f3f3;">
    <tr>
        <td>{{ __('messages.pdf.order_tax') }}</td>
        <td>{{getCurrencyCode()}}{{ number_format((float)$quotation->tax_amount, 2)}}</td>
    </tr>
    <tr>
        <td>{{ __('messages.pdf.discount') }}</td>
        <td>{{getCurrencyCode()}}{{ number_format((float)$quotation->discount, 2)}}</td>
    </tr>
    <tr>
        <td>{{ __('messages.pdf.shipping') }}</td>
        <td>{{getCurrencyCode()}} {{number_format((float)$quotation->shipping, 2)}}</td>
    </tr>
    <tr>
        <td>{{ __('messages.pdf.total') }}</td>
        <td>{{getCurrencyCode()}} {{number_format((float)$quotation->grand_total, 2)}}</td>
    </tr>
    </tbody>
</table>
<table width="100%" style="margin-top: 100px;">
    <tr>
        <td align="center">
            {{ __('messages.pdf.signature') }}
        </td>
    </tr>
</table>
</body>
</html>
