sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'ns/labelprinting/test/integration/FirstJourney',
		'ns/labelprinting/test/integration/pages/DnHeadersList',
		'ns/labelprinting/test/integration/pages/DnHeadersObjectPage',
		'ns/labelprinting/test/integration/pages/DnItemsObjectPage'
    ],
    function(JourneyRunner, opaJourney, DnHeadersList, DnHeadersObjectPage, DnItemsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('ns/labelprinting') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheDnHeadersList: DnHeadersList,
					onTheDnHeadersObjectPage: DnHeadersObjectPage,
					onTheDnItemsObjectPage: DnItemsObjectPage
                }
            },
            opaJourney.run
        );
    }
);