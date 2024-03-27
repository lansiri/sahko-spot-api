        // Number of hours to display and track in the chart
        let nextHoursShown = 6;
        // Arrays to store price data and timestamps for the chart
        let priceData = [];
        let timeLabels = [];
        
        async function download() {
            SetTimer();

            for (let i = 0; i < nextHoursShown; i++) {
                var targetUrl = "https://api.spot-hinta.fi/JustNow?lookForwardHours=" + i + "&isHtmlRequest=true";
                const response = await fetch(targetUrl);

                if (response.ok) {
                    const price = await response.json();
                    let date = new Date(price.DateTime);
                    let timeString = date.toTimeString().split(' ')[0];
                    timeString = timeString.substring(0, timeString.length - 3);
                    timeString = " (" + timeString + ")";

                    document.getElementById('price' + i).innerHTML = (price.PriceWithTax * 100).toFixed(2);
                    document.getElementById('priceText' + i).innerHTML = i == 0 ? "&nbsp;snt/kWh" : "&nbsp;snt" + timeString;

                    // Make element visible
                    document.getElementById('hour' + i).style.visibility = "visible";

                    // Update chart data arrays
                    priceData.push(price.PriceWithTax);
                    timeLabels.push('Hour ' + (i+1));
                }
                else {
                    document.getElementById("price" + i).innerHTML = "Error loading";
                }
            }

            updateChart();
        }

        // Update the chart with fetched data
        function updateChart() {
            var ctx = document.getElementById('electricityPriceChart').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: timeLabels,
                    datasets: [{
                        label: 'Electricity Price (snt/kWh)',
                        data: priceData,
                        backgroundColor: 'lightblue',
                        borderColor: 'blue',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        }

        function SetTimer(color = 'white') {
            let date = new Date();
            var minutesLeft = 60 - date.getMinutes();
            document.getElementById('timer').style.color = color;
        }

        // Periodically check to refresh data
        setInterval(download, 3600000); // Refresh hourly
