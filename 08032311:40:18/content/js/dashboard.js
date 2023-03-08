/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.32751240286253674, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8527381500230097, 500, 1500, "03_signature"], "isController": false}, {"data": [0.02164900967296177, 500, 1500, "03_All_Accounts"], "isController": true}, {"data": [0.8458180147058824, 500, 1500, "02_signature"], "isController": false}, {"data": [0.0, 500, 1500, "02_Create_PSU_Consent"], "isController": true}, {"data": [0.4630394857667585, 500, 1500, "01_login"], "isController": false}, {"data": [0.8436355311355311, 500, 1500, "01_signature"], "isController": false}, {"data": [0.01779935275080906, 500, 1500, "06_Consent_Details"], "isController": true}, {"data": [0.03975959315765141, 500, 1500, "06_consentDetails"], "isController": false}, {"data": [0.8643518518518518, 500, 1500, "07_signature"], "isController": false}, {"data": [0.0265466297322253, 500, 1500, "05_All_Accounts_Transaction"], "isController": true}, {"data": [0.8671441774491682, 500, 1500, "06_signature"], "isController": false}, {"data": [0.011342592592592593, 500, 1500, "07_Delete_Consent"], "isController": true}, {"data": [0.02190959409594096, 500, 1500, "04_All_Accounts_Balance"], "isController": true}, {"data": [0.09848484848484848, 500, 1500, "01_Client_Access_Validation"], "isController": true}, {"data": [0.8674976915974146, 500, 1500, "05_signature"], "isController": false}, {"data": [0.038425925925925926, 500, 1500, "07_deleteConsent"], "isController": false}, {"data": [0.04270544783010157, 500, 1500, "05_allAccountsTransaction"], "isController": false}, {"data": [0.8667588750576303, 500, 1500, "04_signature"], "isController": false}, {"data": [0.041455550437586364, 500, 1500, "03_allAccounts"], "isController": false}, {"data": [0.03989852398523985, 500, 1500, "04_allAccountsBalance"], "isController": false}, {"data": [0.0022988505747126436, 500, 1500, "02_CreateConsent"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30373, 0, 0.0, 1470.6633523194869, 220, 20117, 924.0, 2906.0, 3208.0, 6577.850000000024, 16.867994461935243, 23.72386423282503, 16.102620099177845], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_signature", 2173, 0, 0.0, 494.609756097561, 233, 15711, 452.0, 607.0, 879.7999999999984, 1097.5199999999995, 1.2103846884387373, 1.3474985789259382, 0.7458522835984798], "isController": false}, {"data": ["03_All_Accounts", 2171, 0, 0.0, 3002.8530631045587, 924, 18533, 2947.0, 3536.0, 3849.4000000000005, 7186.560000000016, 1.2090834412374865, 3.0156241298052153, 2.071027691338429], "isController": true}, {"data": ["02_signature", 2176, 0, 0.0, 482.6525735294122, 227, 7951, 455.0, 576.3, 645.0, 1075.38, 1.2104853846128172, 1.3476106820884879, 2.119531537705841], "isController": false}, {"data": ["02_Create_PSU_Consent", 2175, 0, 0.0, 3674.6450574712653, 1615, 11383, 3605.0, 4260.200000000001, 4671.599999999998, 8178.119999999992, 1.2094251755056649, 4.4975498714116915, 4.8188034336553836], "isController": true}, {"data": ["01_login", 2178, 0, 0.0, 1230.8838383838397, 302, 8977, 1213.0, 1488.1000000000001, 1692.1499999999992, 2899.390000000002, 1.2109425169256738, 1.8518906069390677, 0.5085012522246481], "isController": false}, {"data": ["01_signature", 2184, 0, 0.0, 509.3740842490836, 220, 7878, 453.0, 644.5, 939.0, 1210.7500000000023, 1.2132645816737053, 1.3507047100664296, 0.42179901472249903], "isController": false}, {"data": ["06_Consent_Details", 2163, 0, 0.0, 2991.467406380029, 911, 10273, 2935.0, 3550.6000000000004, 3957.199999999996, 7240.160000000001, 1.2085682628744927, 3.962073885224289, 2.0902093687018817], "isController": true}, {"data": ["06_consentDetails", 2163, 0, 0.0, 2511.678687008782, 638, 9820, 2468.0, 2996.2000000000003, 3323.399999999995, 6838.640000000003, 1.208882351100122, 2.617277512098604, 1.3375622107387093], "isController": false}, {"data": ["07_signature", 2160, 0, 0.0, 484.46157407407395, 226, 7559, 449.0, 583.0, 751.6999999999989, 1120.3899999999999, 1.2091769815247833, 1.3461540614631378, 0.753373939660949], "isController": false}, {"data": ["05_All_Accounts_Transaction", 2166, 0, 0.0, 3005.6772853185585, 761, 19277, 2951.0, 3539.3, 3819.3, 7443.919999999998, 1.2089414785253818, 3.004644592624117, 2.0625202763514077], "isController": true}, {"data": ["06_signature", 2164, 0, 0.0, 479.7231977818849, 234, 4648, 449.0, 590.5, 752.0, 1079.7999999999993, 1.2093851416640446, 1.3463858022431747, 0.7535036331852153], "isController": false}, {"data": ["07_Delete_Consent", 2160, 0, 0.0, 3115.355555555553, 774, 10858, 3071.5, 3644.0, 3994.5999999999985, 7488.39999999998, 1.2083206301168323, 2.9724215500627933, 2.08860108916679], "isController": true}, {"data": ["04_All_Accounts_Balance", 2168, 0, 0.0, 3068.030904059043, 800, 20644, 2977.0, 3617.3, 4058.0, 7766.409999999994, 1.2087502815585296, 3.155263186138623, 2.0976066897749095], "isController": true}, {"data": ["01_Client_Access_Validation", 2178, 0, 0.0, 1740.727731864095, 556, 9439, 1694.0, 2137.1000000000004, 2356.0499999999997, 5215.620000000001, 1.209760064253923, 3.1968854822960115, 0.9285853618199057], "isController": true}, {"data": ["05_signature", 2166, 0, 0.0, 494.80424746075795, 221, 16454, 446.0, 585.0, 862.3000000000002, 1107.3099999999995, 1.2096679612236076, 1.3467006599559694, 0.734778781133871], "isController": false}, {"data": ["07_deleteConsent", 2160, 0, 0.0, 2630.893518518517, 542, 10466, 2596.0, 3122.6000000000004, 3421.8499999999995, 6851.939999999994, 1.2085849819887267, 1.6275768458617714, 1.3360529293078502], "isController": false}, {"data": ["05_allAccountsTransaction", 2166, 0, 0.0, 2510.8725761772876, 532, 9949, 2480.5, 2983.0, 3251.6000000000004, 6925.9299999999985, 1.20928098028805, 1.6592185325241313, 1.3285557644766175], "isController": false}, {"data": ["04_signature", 2169, 0, 0.0, 487.9898570769949, 236, 7712, 447.0, 590.0, 787.0, 1072.0, 1.2095681356590056, 1.3465895260266272, 0.7547988659043989], "isController": false}, {"data": ["03_allAccounts", 2171, 0, 0.0, 2508.300322432055, 588, 9927, 2467.0, 2998.0, 3276.0000000000005, 6763.040000000004, 1.2093137770974576, 1.6698922664216846, 1.3262298551566845], "isController": false}, {"data": ["04_allAccountsBalance", 2168, 0, 0.0, 2579.9594095940934, 487, 20117, 2500.5, 3063.1000000000004, 3524.7499999999986, 7091.969999999996, 1.2089963155725751, 1.8099524919655838, 1.3435916085171784], "isController": false}, {"data": ["02_CreateConsent", 2175, 0, 0.0, 3191.914482758613, 1259, 10878, 3134.0, 3724.0, 4103.4, 7661.079999999996, 1.2096276349026793, 3.15164700187534, 2.701580469748464], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30373, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
