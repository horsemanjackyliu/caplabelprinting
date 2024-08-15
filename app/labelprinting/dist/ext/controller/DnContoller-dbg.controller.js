sap.ui.define(['sap/ui/core/mvc/ControllerExtension', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast', 'sap/base/security/URLWhitelist', 'sap/ui/core/message/Message', 'sap/ui/core/message/MessageType'], function (ControllerExtension, JSONModel, MessageToast, URLWhitelist, Message, MessageType) {
	'use strict';

	return ControllerExtension.extend('ns.labelprinting.ext.controller.DnContoller', {
		printPreview: function (oEvent) {
			// let oModel = this.base.getExtensionAPI().getModel();


			let oModel = oEvent.getModel();
			const sFunctionname = 'com.cap.labelprint.dnservice.render';
			var sPath = oEvent.getPath();
			// sPath = sPath.split('/')[2].replace('Items','DnItems');
			console.log(sPath);
			const oFunction = oModel.bindContext(`${sPath}/${sFunctionname}(...)`);
			oFunction.setParameter('template', "labelprint3\/labelprint3");
			oFunction.execute().then(function () {
				const oContext = oFunction.getBoundContext();
				var stream = oContext.getProperty('value');
				 console.log(stream);
				 stream = stream.replaceAll('_','/').replaceAll('-','+');
				 const deccont = atob(stream);	
				const byteNumbers = new Array(deccont.length);
				for (let i = 0; i < deccont.length; i++) {
					byteNumbers[i] = deccont.charCodeAt(i);
				}
				const byteArray = new Uint8Array(byteNumbers);				
				var blob = new Blob([byteArray],{type: "application/pdf"});
				const pdfurl = URL.createObjectURL(blob);
				let oPdfmodel = new JSONModel({
					Source: pdfurl,
					Title: 'Outbound Delivery',
					Height: "1000px"
				});
				URLWhitelist.add("blob");
				this.getView().setModel(oPdfmodel,"pdf");

				let showPdf = true;
				let oPdfview = new JSONModel({
					Viewshow: showPdf
				});
				this.getView().setModel(oPdfview,'pdfview');

			}.bind(this)).catch(err => {
				console.log(err);
			})


		},





		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf ns.labelprinting.ext.controller.DnContoller
			 */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				// var oModel = this.base.getExtensionAPI().getModel();
				let showPdf = false;
				let oPdfview = new JSONModel({
					Viewshow: showPdf
				});
				this.getView().setModel(oPdfview,'pdfview');
	
			},
			routing: {
				onAfterBinding: async function (oBindingContext, mParameters) {
					let showPdf = false;
					let oPdfview = new JSONModel({
						Viewshow: showPdf
					});
					var extensionAPI = this.base.getExtensionAPI();
					//  this.byId('_IDGenPDFViewer1').setModel('pdf',oPdfview);
				//  extensionAPI.byId('_IDGenPDFViewer1').setModel('pdf',oPdfview)
				var oModel =extensionAPI.getModel();
				const sGetTemplates = 'getTemplates';
				const oFunction = oModel.bindContext(`/${sGetTemplates}(...)`);
				// oFunction.execute().then(function () {

				// 	const oContext = oFunction.getBoundContext();
				// 	console.log(oContext);
				// 	var aTemplates = oContext.getProperty('value');
				// 	console.log(aTemplates);
					
				// })
				var oFresult = await oFunction.execute();
				var test = oFresult.getBoundContext().getProperty('value');
				console.log(test);
				// 	console.log(oContext);

				
				
				
				// oModel.bindContext

				}

			}

		}
	});
});
