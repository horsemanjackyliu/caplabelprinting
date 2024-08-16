sap.ui.define(['sap/ui/core/mvc/ControllerExtension', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast', 'sap/base/security/URLWhitelist', 'sap/ui/core/message/Message', 'sap/ui/core/message/MessageType'], function (ControllerExtension, JSONModel, MessageToast, URLWhitelist, Message, MessageType) {
	'use strict';

	return ControllerExtension.extend('ns.labelprinting.ext.controller.DnContoller', {
		onChange: function (oEvent) {
			console.log('change triggered');
			let sPrintQ = '';
			let sTemplate = '';
			let sSource = oEvent.getSource().getId();
			let bPdfVisible = this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomSubSection::PrintPreview").getVisible()
			if (sSource == "ns.labelprinting::DnItemsObjectPage--fe::HeaderFacetCustomContainer::RenderTemplate--printQId") {
				sPrintQ = oEvent.getParameter('selectedItem').getProperty('key')
				if (sPrintQ == '') {
					this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomAction::Print").setEnabled(false);
				} else {
					if (bPdfVisible) { this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomAction::Print").setEnabled(true); }
					else {
						this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomAction::Print").setEnabled(false);
					}
				}
			} else {
				sTemplate = oEvent.getParameter('selectedItem').getProperty('key');
				if (sTemplate == '') {
					this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomAction::PrintPreview").setEnabled(false);
				} else {
					this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomAction::PrintPreview").setEnabled(true);
				}
			}
		},
		print: function (oEvent) {
			let sPrintQ = this.getView().byId('ns.labelprinting::DnItemsObjectPage--fe::HeaderFacetCustomContainer::RenderTemplate--printQId').getProperty('selectedKey');
			let sSource = this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomSubSection::PrintPreview--pdfViewId").getSource();
			let filename = this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::FormContainer::ItemDetails::FormElement::DataField::DeliveryDocument::Field-content").getContentDisplay().mProperties.text + this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::FormContainer::ItemDetails::FormElement::DataField::DeliveryDocumentItem::Field-content").getContentDisplay().mProperties.text + '.pdf';
			fetch(sSource)
				.then(response => response.blob())
				.then(blob => {
					// Convert the Blob to a string
					const reader = new FileReader();
					reader.onload = function () {
						const dataUrl = reader.result;
						console.log(dataUrl);
						const base64String = dataUrl.split(',')[1];
						console.log(base64String);
						console.log(typeof (base64String));

						let oModel = oEvent.getModel();
						const sPrint = 'print';
						const oFunction = oModel.bindContext(`/${sPrint}(...)`);
						oFunction.setParameter('pdf', base64String);
						oFunction.setParameter('fileName', filename);
						oFunction.setParameter('printQ', sPrintQ);
						oFunction.execute().then(function () {
							const oContext = oFunction.getBoundContext();
							var result = oContext.fetchValue().getResult();
							MessageToast.show(result.value);
						}).catch(err => {
							console.log(err);
						})
					};
					reader.readAsDataURL(blob);
				})
				.catch(error => {
					console.error('Error fetching Blob URL:', error);
				});

		},
		printPreview: function (oEvent) {
			let sPrintQ = this.getView().byId('ns.labelprinting::DnItemsObjectPage--fe::HeaderFacetCustomContainer::RenderTemplate--printQId').getProperty('selectedKey');
			// console.log(sPrintQ);
			let sTemplate = this.getView().byId('ns.labelprinting::DnItemsObjectPage--fe::HeaderFacetCustomContainer::RenderTemplate--templateId').getProperty('selectedKey');
			// console.log(sTemplate);
			let oModel = oEvent.getModel();
			const sFunctionname = 'com.cap.labelprint.dnservice.render';
			var sPath = oEvent.getPath();
			// sPath = sPath.split('/')[2].replace('Items','DnItems');
			console.log(sPath);
			const oFunction = oModel.bindContext(`${sPath}/${sFunctionname}(...)`);
			oFunction.setParameter('template', sTemplate);
			oFunction.execute().then(function () {
				const oContext = oFunction.getBoundContext();
				var stream = oContext.getProperty('value');
				//  console.log(stream);
				stream = stream.replaceAll('_', '/').replaceAll('-', '+');
				const deccont = atob(stream);
				const byteNumbers = new Array(deccont.length);
				for (let i = 0; i < deccont.length; i++) {
					byteNumbers[i] = deccont.charCodeAt(i);
				}
				const byteArray = new Uint8Array(byteNumbers);
				var blob = new Blob([byteArray], { type: "application/pdf" });
				const pdfurl = URL.createObjectURL(blob);
				let oPdfmodel = new JSONModel({
					Source: pdfurl,
					Title: 'Outbound Delivery',
					Height: "1000px"
				});
				URLWhitelist.add("blob");
				this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomSubSection::PrintPreview").setVisible(true);
				this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomSubSection::PrintPreview--pdfViewId").setModel(oPdfmodel);
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

			},
			routing: {
				onBeforeBinding: async function (oContext) {
					this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomAction::PrintPreview").setEnabled(false);
					this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomSubSection::PrintPreview").setVisible(false);
					this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::CustomAction::Print").setEnabled(false)
					var oModel = oContext.getModel();
					const sGetTemplates = 'getTemplates';
					const oFunction = oModel.bindContext(`/${sGetTemplates}(...)`);
					oFunction.execute().then(function () {
						const oContext = oFunction.getBoundContext();
						// console.log(oContext);
						var oTempback = oContext.fetchValue().getResult();
						// console.log(typeof(oTempback));
						// console.log(oTempback);
						let oTemplates = new JSONModel({
							value: oTempback.value
						})
						// console.log(aTemplates);
						// console.log(oTemplates);
						this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::HeaderFacetCustomContainer::RenderTemplate--templateId").setModel(oTemplates);

					}.bind(this)).catch(err => {
						console.log(err);
					})
					const sGetPrintQs = 'getPrintQs';
					const oFunctionPrint = oModel.bindContext(`/${sGetPrintQs}(...)`);
					oFunctionPrint.execute().then(function () {
						const oContext = oFunctionPrint.getBoundContext();
						var oPrintQsback = oContext.fetchValue().getResult();
						let oPrintQs = new JSONModel({
							value: oPrintQsback.value
						});
						this.getView().byId("ns.labelprinting::DnItemsObjectPage--fe::HeaderFacetCustomContainer::RenderTemplate--printQId").setModel(oPrintQs);
					}.bind(this)).catch(err => {
						console.log(err);
					})
				},

				onAfterBinding: async function (oContext) {
				}

			}

		}
	});
});
