// using {com.cap.labelprint as my} from '../db/schema';
using {API_OUTBOUND_DELIVERY_SRV_0002 as dnApi} from './external/API_OUTBOUND_DELIVERY_SRV_0002';


namespace com.cap.labelprint;


service dnservice {

    @readonly
    entity DnHeaders  as
        projection on dnApi.A_OutbDeliveryHeader {
            key DeliveryDocument,
                DeliveryDate,
                ActualDeliveryRoute,
                ActualGoodsMovementDate,
                BillingDocumentDate,
                BillOfLading,
                CreationDate,
                CreatedByUser,
                DocumentDate,
                HeaderGrossWeight,
                HeaderNetWeight,
                HeaderVolume,
                HeaderVolumeUnit,
                HeaderWeightUnit,
                to_DeliveryDocumentItem  as Items  : redirected to  DnItems
        };

    @readonly
    entity DnItems  as
        projection on dnApi.A_OutbDeliveryItem {
            key DeliveryDocument,
            key DeliveryDocumentItem,
                ActualDeliveredQtyInBaseUnit,
                ActualDeliveryQuantity,
                BaseUnit,
                Batch,
                CreatedByUser,
                CreationDate,
                DeliveryDocumentItemCategory,
                DeliveryGroup,
                DeliveryQuantityUnit,
                Division,
                GoodsMovementReasonCode,
                GoodsMovementStatus,
                GoodsMovementType,
                InspectionLot,
                ItemGrossWeight,
                ItemNetWeight,
                ItemVolume,
                ItemVolumeUnit,
                ItemWeightUnit,
                ManufactureDate,
                Material,
                MaterialByCustomer,
                NumberOfSerialNumbers,
                OrderID,
                OrderItem,
                PackingStatus,
                PickingStatus,
                ProfitCenter,
                DeliveryDocumentItemText,
                DistributionChannel
        }
        actions {          
            function render(template : String)                          returns LargeBinary;            
            function renderAndPrint(template : String, printQ : String) returns String;
            function test() returns array of String;
        };

    function getTemplates()                                               returns array of ObjTemplate;

    function getPrintQs()                                                 returns array of ObjPrintQ;

    function print(pdf : LargeBinary, printQ : String, fileName : String) returns String;

}
// type ObjTemplate : { 'name' : String};

define type ObjTemplate {
  name : String;
}
define type ObjPrintQ {
  qname : String;
  qdescription: String;
  qstatus: String(1);
  qformatDescript: String;
  cleanupPrd: Integer;
  techUserName: String;
  creator: String;
  createdOn: Timestamp;
  profileEnabled: Boolean;
  locationId:String;
  locationIdType:String;


}

// annotate dnservice with @(requires: 'Viewer') ;
