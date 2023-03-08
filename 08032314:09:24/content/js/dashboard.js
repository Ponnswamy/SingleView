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

    var data = {"OkPercent": 99.78608100399316, "KoPercent": 0.2139189960068454};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4087516638144134, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.914713216957606, 500, 1500, "03_signature"], "isController": false}, {"data": [0.1169576059850374, 500, 1500, "03_All_Accounts"], "isController": true}, {"data": [0.9234413965087281, 500, 1500, "02_signature"], "isController": false}, {"data": [0.0024937655860349127, 500, 1500, "02_Create_PSU_Consent"], "isController": true}, {"data": [0.5445052212829438, 500, 1500, "01_login"], "isController": false}, {"data": [0.9015415216310293, 500, 1500, "01_signature"], "isController": false}, {"data": [0.1096951524237881, 500, 1500, "06_Consent_Details"], "isController": true}, {"data": [0.16041979010494753, 500, 1500, "06_consentDetails"], "isController": false}, {"data": [0.9208813219829745, 500, 1500, "07_signature"], "isController": false}, {"data": [0.12543728135932034, 500, 1500, "05_All_Accounts_Transaction"], "isController": true}, {"data": [0.9207896051974013, 500, 1500, "06_signature"], "isController": false}, {"data": [0.08037055583375062, 500, 1500, "07_Delete_Consent"], "isController": true}, {"data": [0.12075848303393213, 500, 1500, "04_All_Accounts_Balance"], "isController": true}, {"data": [0.23272003978120337, 500, 1500, "01_Client_Access_Validation"], "isController": true}, {"data": [0.9260369815092454, 500, 1500, "05_signature"], "isController": false}, {"data": [0.15523284927391087, 500, 1500, "07_deleteConsent"], "isController": false}, {"data": [0.16591704147926037, 500, 1500, "05_allAccountsTransaction"], "isController": false}, {"data": [0.9049401197604791, 500, 1500, "04_signature"], "isController": false}, {"data": [0.1685785536159601, 500, 1500, "03_allAccounts"], "isController": false}, {"data": [0.1659181636726547, 500, 1500, "04_allAccountsBalance"], "isController": false}, {"data": [0.020698254364089775, 500, 1500, "02_CreateConsent"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28048, 60, 0.2139189960068454, 1725.784369652029, 222, 300275, 930.0, 2785.0, 3066.9500000000007, 3664.9900000000016, 14.377153202694384, 20.18498577303597, 13.72235720719647], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03_signature", 2005, 0, 0.0, 432.3366583541147, 228, 2296, 406.0, 545.0, 829.3999999999978, 1025.5200000000004, 1.2203680337831957, 1.3586128501101984, 0.7519857038906307], "isController": false}, {"data": ["03_All_Accounts", 2005, 4, 0.19950124688279303, 3016.5566084788043, 763, 301158, 2707.0, 3221.0, 3408.7999999999993, 4521.040000000001, 1.0318090520273633, 2.5712997986171184, 1.7673448934972356], "isController": true}, {"data": ["02_signature", 2005, 0, 0.0, 418.0812967581045, 231, 1184, 412.0, 528.4000000000001, 577.0, 956.0, 1.4921230045180442, 1.661152563623604, 2.612672409278177], "isController": false}, {"data": ["02_Create_PSU_Consent", 2005, 1, 0.04987531172069826, 3222.9152119700802, 1341, 300759, 3381.0, 3875.4, 4071.7999999999993, 4805.020000000002, 1.2195960187033108, 4.5339844679048555, 4.859327887021005], "isController": true}, {"data": ["01_login", 2011, 6, 0.29835902536051717, 1872.5882645450024, 280, 300263, 1077.0, 1336.8, 1437.7999999999997, 2131.7599999999966, 1.032824932835564, 1.5757794528441718, 0.4337057823430591], "isController": false}, {"data": ["01_signature", 2011, 0, 0.0, 438.01839880656394, 225, 3094, 415.0, 561.0, 790.7999999999997, 981.7599999999998, 1.218832938672278, 1.356903857506247, 0.4237348888352842], "isController": false}, {"data": ["06_Consent_Details", 2001, 15, 0.7496251874062968, 4672.638180909548, 778, 301243, 2718.0, 3233.6, 3420.399999999999, 8079.42, 1.029912763661013, 3.3621643671736794, 1.7812260785582559], "isController": true}, {"data": ["06_consentDetails", 2001, 15, 0.7496251874062968, 4249.426786606697, 521, 300269, 2270.0, 2702.8, 2882.0, 7468.340000000007, 1.030050076597427, 2.2158771903041967, 1.139694078891489], "isController": false}, {"data": ["07_signature", 1997, 0, 0.0, 422.16875312969466, 227, 2115, 408.0, 529.0, 601.1999999999998, 979.0, 1.215925765814037, 1.3536673564726585, 0.7575787486224177], "isController": false}, {"data": ["05_All_Accounts_Transaction", 2001, 10, 0.49975012493753124, 2404.006496751627, 699, 7792, 2715.0, 3211.3999999999996, 3378.8999999999996, 4064.5600000000004, 1.2178310921224405, 3.0251990491590512, 2.0776864432987336], "isController": true}, {"data": ["06_signature", 2001, 0, 0.0, 423.21139430284853, 223, 1506, 408.0, 542.0, 666.7999999999997, 970.9200000000001, 1.218166200240711, 1.3561615901117292, 0.7589746442905992], "isController": false}, {"data": ["07_Delete_Consent", 1997, 17, 0.8512769153730596, 5065.976965448181, 859, 301076, 2821.0, 3318.6000000000004, 3488.1, 8532.019999999997, 1.0279941810484614, 2.519869348831062, 1.7769040043513444], "isController": true}, {"data": ["04_All_Accounts_Balance", 2004, 7, 0.34930139720558884, 3478.4985029940094, 712, 301001, 2729.5, 3269.0, 3493.5, 4761.4000000000015, 1.0307093790438884, 2.686287725493393, 1.7886431314072166], "isController": true}, {"data": ["01_Client_Access_Validation", 2011, 6, 0.29835902536051717, 2310.607160616608, 534, 301110, 1526.0, 1863.8, 2049.7999999999997, 2723.839999999998, 1.0310467611237435, 2.7209115259594605, 0.791408939690686], "isController": true}, {"data": ["05_signature", 2001, 0, 0.0, 417.68715642178944, 224, 1749, 407.0, 525.0, 593.5999999999995, 993.9200000000001, 1.2180571957291908, 1.3560402374328882, 0.7398745856870671], "isController": false}, {"data": ["07_deleteConsent", 1997, 17, 0.8512769153730596, 4643.808212318481, 552, 300271, 2371.0, 2821.2, 2973.1, 8048.019999999997, 1.0281217292008709, 1.3755933572305994, 1.1365564428275252], "isController": false}, {"data": ["05_allAccountsTransaction", 2001, 10, 0.49975012493753124, 1986.3188405797098, 306, 7019, 2266.0, 2724.8, 2846.8999999999996, 3443.96, 1.217995657580699, 1.6696361159984126, 1.3381299949006704], "isController": false}, {"data": ["04_signature", 2004, 0, 0.0, 432.5434131736526, 222, 2023, 409.0, 556.0, 742.25, 1024.3500000000006, 1.2189528927017323, 1.3570374000781005, 0.7606551742543037], "isController": false}, {"data": ["03_allAccounts", 2005, 4, 0.19950124688279303, 2584.219451371566, 522, 300275, 2260.0, 2678.4, 2838.0999999999995, 3873.6400000000003, 1.031933849180166, 1.4227781914162663, 1.1316853100999817], "isController": false}, {"data": ["04_allAccountsBalance", 2004, 7, 0.34930139720558884, 3045.9540918163666, 474, 300261, 2281.0, 2717.5, 2888.5, 4103.55, 1.0308398052309462, 1.539013022004109, 1.1456012679226726], "isController": false}, {"data": ["02_CreateConsent", 2005, 1, 0.04987531172069826, 2804.833915211971, 1105, 300260, 2925.0, 3380.4, 3554.7, 4274.560000000001, 1.2197837362979653, 3.17671996636165, 2.7242630907357883], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 50, 83.33333333333333, 0.1782658300057045], "isController": false}, {"data": ["500/Internal Server Error", 10, 16.666666666666668, 0.0356531660011409], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28048, 60, "504/Gateway Time-out", 50, "500/Internal Server Error", 10, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["01_login", 2011, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["06_consentDetails", 2001, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["07_deleteConsent", 1997, 17, "504/Gateway Time-out", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["05_allAccountsTransaction", 2001, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["03_allAccounts", 2005, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04_allAccountsBalance", 2004, 7, "504/Gateway Time-out", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02_CreateConsent", 2005, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
