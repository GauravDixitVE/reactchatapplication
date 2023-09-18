<?php
	if (session_status() == PHP_SESSION_NONE) { session_start(); }
	include ('myfunctions2.php');
	
	require('db-config.php');
	$connection = mysql_connect("$host", "$db_username", "$db_password")or die("cannot connect"); 
	mysql_select_db("$db_name")or die("cannot select DB");

	$clearDisabled = "";
	if (getLoginAccess($_SESSION['user_id'],$_SESSION['login_id'],17,'Page',4) == 0){
		$clearDisabled = ' disabled="" readonly=""';
	}
	
	include("phpgrid/lib/inc/jqgrid_dist.php");
	
	$sessionID = session_id();
	$_SESSION['sessionID'] = $sessionID;
	
	//get data from Events table
	$sql = "Select sName, dtStart, sLocation, lBadgePageLayoutID, lBadgeLayoutID, lBadgeReportID from Events where lAccountID =";
	$sql = $sql.$_GET["user_id"];
	$sql = $sql." and lEventID = ";
	$sql = $sql.$_GET["event_id"];
	$result=mysql_query($sql);
	if ($error = mysql_error()) {
		error_log("[".date('d-M-Y H:i:s')." UTC] printreg.php line #".__LINE__." Error: ".$error." query: ".$sql.PHP_EOL, 3, "myphplog.log");
	}
	
	$rows=mysql_fetch_array($result);
	$event_name = $rows[mysql_field_name($result, 0)];
	$event_start = $rows[mysql_field_name($result, 1)];
	$event_location = $rows[mysql_field_name($result, 2)];
	$_SESSION['pagelayoutid'] = $rows[mysql_field_name($result, 3)];
	$_SESSION['badgelayoutid'] = $rows[mysql_field_name($result, 4)];
	$_SESSION['badgereportid'] = number_format($rows[mysql_field_name($result, 5)],0,".","");

	$sql = "Delete From PrintRegTemp Where lAccountID =";
	$sql = $sql.$_GET["user_id"];			
	$sql = $sql." and lEventID = ";
	$sql = $sql.$_GET["event_id"];
	$sql = $sql." and sSessionID = '";
	$sql = $sql.$sessionID."'";
	$result=mysql_query($sql);
	if ($error = mysql_error()) {
		error_log("[".date('d-M-Y H:i:s')." UTC] printreg.php line #".__LINE__." Error: ".$error." query: ".$sql.PHP_EOL, 3, "myphplog.log");
	}

	//main registrants
	$sql = "INSERT into PrintRegTemp (sBadgeID, lRegID, lAccountID, lEventID, lRegType, sFirstName, sLastName, sTitle, sCompany,  sEmail, BalanceDue, nStatus, sErrorMessage, sSessionID, bAlreadyPrinted,lRegisteredAs, Total1, TotalPaid) ";
	$sql = $sql." Select concat(Registrants.lAccountID,Registrants.lEventID,Registrants.lRegID) as sBadgeID, Registrants.lRegID, Registrants.lAccountID, Registrants.lEventID,lRegType, sFirstName, sLastName, sTitle, sCompany, Registrants.sEmail, RegistrantsBalance.dBalance as BalanceDue, 0, '','".$sessionID."',";
	$sql = $sql." COALESCE((Select nStatus  From RegPrintHistory Where RegPrintHistory.lAccountID = ".$_GET["user_id"]." and RegPrintHistory.lEventID = ".$_GET["event_id"]." and RegPrintHistory.lRegID = Registrants.lRegID Order by dtCreatedOn DESC LIMIT 1),0) as bPrinted";
	$sql = $sql." , 0, 0, 0 from Registrants ";
	$sql = $sql." INNER JOIN RegistrantsBalance on RegistrantsBalance.lAccountID = Registrants.lAccountID and  RegistrantsBalance.lEventID = Registrants.lEventID and  RegistrantsBalance.lRegID = Registrants.lRegID ";
	$sql = $sql." Where Registrants.lAccountID = ";
	$sql = $sql.$_GET["user_id"];
	$sql = $sql." and Registrants.lEventID = ";
	$sql = $sql.$_GET["event_id"];
	$sql = $sql." and Registrants.nStatus = 0 and Registrants.lRegType <> 0 ";	
	$sql = $sql." Group by Registrants.lRegID, Registrants.lAccountID, Registrants.lEventID,lRegType, sFirstName, sLastName, sCompany, Registrants.sEmail ";
	$result=mysql_query($sql);
	if ($error = mysql_error()) {
		error_log("[".date('d-M-Y H:i:s')." UTC] printreg.php line #".__LINE__." Error: ".$error." query: ".$sql.PHP_EOL, 3, "myphplog.log");
	}
	
	//guests
	$sql = "INSERT into PrintRegTemp (sBadgeID, lRegID, lAccountID, lEventID, lGuestID, lRegType, sFirstName, sLastName, sTitle, sCompany, sEmail,BalanceDue,  nStatus, sErrorMessage, sSessionID, bAlreadyPrinted,lRegisteredAs) ";
	//$sql = $sql." Select concat(RegGuests.lAccountID,RegGuests.lEventID,RegGuests.lGuestID) as sBadgeID, RegGuests.lRegID, RegGuests.lAccountID, RegGuests.lEventID, RegGuests.lGuestID, if(nType = 0,-2, Registrants.lRegType) as lRegType, RegGuests.sFirstName, RegGuests.sLastName, RegGuests.sTitle, Registrants.sCompany, RegGuests.sEmail,0 as BalanceDue, 0, '','".$sessionID."',";
	//Oct 11 2016 show guests reg type based on main rgeistrant instead of guest reg type.
	$sql = $sql." Select concat(RegGuests.lAccountID,RegGuests.lEventID,RegGuests.lGuestID) as sBadgeID, RegGuests.lRegID, RegGuests.lAccountID, RegGuests.lEventID, RegGuests.lGuestID, Registrants.lRegType as lRegType, RegGuests.sFirstName, RegGuests.sLastName, RegGuests.sTitle, Registrants.sCompany, RegGuests.sEmail,0 as BalanceDue, 0, '','".$sessionID."',";
	$sql = $sql." COALESCE((Select nStatus  From RegPrintHistory Where RegPrintHistory.lAccountID = ".$_GET["user_id"]." and RegPrintHistory.lEventID = ".$_GET["event_id"]." and RegPrintHistory.lRegID = RegGuests.lGuestID Order by dtCreatedOn DESC LIMIT 1),0) as bPrinted";
	$sql = $sql.", if(nType = 0,-2,if(Registrants.lRegType = -1,-4,-3)) as lRegisteredAs from RegGuests  ";
	$sql = $sql." INNER JOIN Registrants ON Registrants.lAccountID = RegGuests.lAccountID and Registrants.lEventID = RegGuests.lEventID and Registrants.lRegID = RegGuests.lRegID ";
	$sql = $sql." Where RegGuests.lAccountID = ";
	$sql = $sql.$_GET["user_id"];
	$sql = $sql." and RegGuests.lEventID = ";
	$sql = $sql.$_GET["event_id"];
	$sql = $sql." and RegGuests.nStatus = 0 and Registrants.nStatus = 0";	
	$sql = $sql." Group by RegGuests.lGuestID, RegGuests.lAccountID, RegGuests.lEventID,nType, RegGuests.sFirstName, RegGuests.sLastName, RegGuests.sEmail ";
	$result=mysql_query($sql);
	if ($error = mysql_error()) {
		error_log("[".date('d-M-Y H:i:s')." UTC] printreg.php line #".__LINE__." Error: ".$error." query: ".$sql.PHP_EOL, 3, "myphplog.log");
	}
	
	
	//recalculate the records for group registration
	//if registeredAs = 0 and lRegType = 0 this means it is main contact from group registration
	$sql = "Update PrintRegTemp set BalanceDue = 0 Where lRegisteredAs = 0 ";
	$sql = $sql." and lAccountID =";
	$sql = $sql.$_GET["user_id"];			
	$sql = $sql." and lEventID = ";
	$sql = $sql.$_GET["event_id"];
	$sql = $sql." and sSessionID = '";
	$sql = $sql.$sessionID."'";
	$sql = $sql." and lRegID = (Select rg.lRegID From RegistrantsGroups as rg Where rg.lRegID = PrintRegTemp.lRegID and rg.lAccountID = PrintRegTemp.lAccountID and rg.lEventID = PrintRegTemp.lEventID) ";
	$result=mysql_query($sql);
	if ($error = mysql_error()) {
		error_log("[".date('d-M-Y H:i:s')." UTC] reglist.php line #".__LINE__." Error: ".mysql_error()." query: ".$sql.PHP_EOL, 3, "myphplog.log");
	}
	
	
	
	$g = new jqgrid();
	$grid["caption"] = "";
	$grid["forceFit"] = true;
	$grid["autowidth"] = true; 
	$grid["autoresize"] = true;
	$grid["scroll"] = false; 
	$grid["shrinkToFit"] = true;
	$grid["footerrow"] = false;
	$grid["cellEdit"] = false; 
	$grid["rownumbers"] = true;
	$grid["rownumWidth"] = 30;
	$grid["width"] = 1280;
	$grid["height"] = "260";
	$grid["rowNum"] = 10;
	$grid["rowList"] = array(10,20,30,40,50,60,70,80,90,100,All);
	$grid["multiselect"] = true; 
	$grid["sortname"] = "sLastName ASC,sFirstname ASC, sCompany ASC, sSessionID"; 
	$grid["sortorder"] = "ASC";
	
	// initialize search
	// operators: ['eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en','cn','nc']
//	$sarr = <<< SEARCH_JSON
//	{ 
//		"groupOp":"AND",
//		"rules":[
//		  {"field":"bAlreadyPrinted","op":"eq","data":"0"}
//		 ]
//	}
//SEARCH_JSON;
//
//	$grid["search"] = true; 
//	$grid["postData"] = array("filters" => $sarr ); 

	$g->set_options($grid);
	
	$g->set_actions(array( 
                        "add"=>false,
                        "edit"=>false,
                        "clone"=>false,
                        "bulkedit"=>false,                           
                        "delete"=>false,
                        "view"=>false,
                        "rowactions"=>false,
                        "autofilter" => true,
                        "inlineadd" => false,
                        "showhidecolumns" => false,
                        "export_excel"=>false, 
                        "export_pdf"=>false, 
                        "export_csv"=>false, 
                        "search" => "advance" 
                    ) 
                );   
	
	
	
	
	// set database table for CRUD operations
	$sql = "SELECT `lID`, `sBadgeID`, `lAccountID`, `lEventID`, `lRegID`,lGuestID, `sFirstName`, `sLastName`, `sCompany`, `sEmail`, `lRegisteredAs`, `lRegType`, BalanceDue, `bAlreadyPrinted`, `nStatus`, `sErrorMessage`, `sSessionID`, `bPrint` from PrintRegTemp where sSessionID = '".$sessionID."' and lAccountID =";
	$sql = $sql.$_GET["user_id"];
	$sql = $sql." and lEventID = ";
	$sql = $sql.$_GET["event_id"];
	$sql = $sql." and lRegType <> 0";
	$g->select_command = $sql;
	
	$col = array();	
	$col["name"] = "lID";
	$col["width"] = "0";
	$col["hidden"] = true;
	$col["editrules"] = array("edithidden"=>false);
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "lRegID";
	$col["title"] = "Reg_ID";
	$col["width"] = "40";
	$col["edittype"] = "text";
	$col["editable"] = true;
	$col["searchoptions"]["sopt"] = array("eq");
	$col["editrules"] = array("edithidden"=>false);
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "lGuestID";
	$col["title"] = "Guest_ID";
	$col["width"] = "40";
	$col["edittype"] = "text";
	$col["editable"] = true;
	$col["searchoptions"]["sopt"] = array("eq");
	$col["editrules"] = array("edithidden"=>false);
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "lEventID";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "lAccountID";
	$col["hidden"] = true;
	$cols[] = $col;
	
	//reg type id
	$col = array();	
	$col["name"] = "lRegisteredAs";	
	$col["title"] = "Reg_As";
	$col["width"] = "100";
	$col["align"] = "center";	
	$col["dbname"] = "lRegisteredAs"; 
	$col["editable"] = true;
	$col["edittype"] = "select"; 
	$list1 = "";
	$list1 = $list1."0:Main Registrant;";
	$list1 = $list1."-1:Exhibitor;";
	$list1 = $list1."-2:Guest;";
	$list1 = $list1."-3:Additional Registrant;";
	$list1 = $list1."-4:Booth Staff";	
	$col["editoptions"] = array("value"=>":;".$list1); 
	$col["formatter"] = "select"; 
	$col["stype"] = "select-multiple";
	$col["searchoptions"] = array("value"=>":;".$list1); 
	$col["searchoptions"]["sopt"] = array("eq");
	$cols[] = $col;	
	
	//reg type id
	$col = array();	
	$col["name"] = "lRegType";	
	$col["title"] = "Reg Type";
	$col["width"] = "100";
	$col["align"] = "center";	
	$col["dbname"] = "lRegType"; 
	$col["editable"] = true;
	$col["edittype"] = "select"; 
	
	//get reg types list
	$sql = "Select lRegTypeID, sCode from RegTypes Where lAccountID =";
	$sql = $sql.$_GET["user_id"];
	$sql = $sql." and lEventID = ";
	$sql = $sql.$_GET["event_id"];
	$sql = $sql." and nStatus <> 1";	
	$result=mysql_query($sql);
	if ($error = mysql_error()) {
		echo "line 75:".mysql_error();
	}
	$list1 = "";
	while($rows=mysql_fetch_array($result)){
		if ($list1 != ""){
			$list1 = $list1.";";
		}	
		$list1 = $list1.$rows[mysql_field_name($result, 0)].":".$rows[mysql_field_name($result, 1)];
	}
		
	//add exhibitors
	if ($list1 != ""){
		$list1 = $list1.";";
	}
	$list1 = $list1."-1:Exhibitor";
	
	//$list1 = $list1.";";
	//$list1 = $list1."-2:Guest";

	//$list1 = $list1.";";
	//$list1 = $list1."-3:Additional Registrant";

	//$list1 = $list1.";";
	//$list1 = $list1."-4:Booth Staff";

	
	$col["editoptions"] = array("value"=>":;".$list1); 
	$col["formatter"] = "select"; 
	$col["stype"] = "select-multiple";
	$col["searchoptions"] = array("value"=>":;".$list1); 
	$col["searchoptions"]["sopt"] = array("eq");
	$cols[] = $col;	
	//end of reg type id
	
	/*$col = array();	
	$col["name"] = "sPrefix";
	$col["hidden"] = true;
	$cols[] = $col;*/
	
	$col = array();	
	$col["name"] = "sFirstName";
	$col["title"] = "First Name";
	$col["width"] = "100";
	$col["edittype"] = "text";
	$col["editable"] = true;
	//$col["searchoptions"]["sopt"] = array("bw");
	$cols[] = $col;
	
	/*$col = array();	
	$col["name"] = "sMiddleName";
	$col["hidden"] = true;
	$cols[] = $col;*/
	
	$col = array();	
	$col["name"] = "sLastName";
	$col["title"] = "Last Name";
	$col["width"] = "100";
	$col["edittype"] = "text";
	$col["editable"] = true;
	$col["searchoptions"]["sopt"] = array("bw");
	$cols[] = $col;
	
	/*$col = array();	
	$col["name"] = "sSuffix";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sCredentials";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sTitle";
	$col["hidden"] = true;
	$cols[] = $col;*/
	
	$col = array();	
	$col["name"] = "sCompany";
	$col["title"] = "Company";
	$col["width"] = "100";
	$col["edittype"] = "text";
	$col["editable"] = true;
	$col["searchoptions"]["sopt"] = array("bw");
	$cols[] = $col;
	
	/*$col = array();	
	$col["name"] = "sAddress1";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sAddress2";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sAddress3";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sCity";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sState";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sZip";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sCountry";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sPhone";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sCell";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sFax";
	$col["hidden"] = true;
	$cols[] = $col;
	*/
	$col = array();	
	$col["name"] = "sEmail";	
	$col["title"] = "Email";
	$col["width"] = "260";
	$col["edittype"] = "text";
	$col["editable"] = true;
	$col["searchoptions"]["sopt"] = array("bw");
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sBadgeID";
	$col["hidden"] = true;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "bAlreadyPrinted";	
	$col["title"] = "Printed";
	$col["width"] = "40";
	$col["align"] = "center";	
	$col["editable"] = true;
	$col["edittype"] = "select"; 
	$col["editoptions"] = array("value"=>"0:No;1:Yes"); 
	$col["formatter"] = "select"; 	
	$col["stype"] = "select-multiple";
	$col["searchoptions"] = array("value"=>"0:No;1:Yes","defaultValue"=>'0',"sopt" => array("eq")); 
	$cols[] = $col;	
	
	$col = array();	
	$col["name"] = "BalanceDue";
	$col["title"] = "Balance";
	$sumFields = $sumFields.$col["name"].",";
	$col["width"] = "70";
	$col["align"] = "right";
	$col["formatter"] = "number";
	$col["formatoptions"] = array("prefix" => "",
							"suffix" => '',
							"thousandsSeparator" => "",
							"decimalSeparator" => ".",
							"decimalPlaces" => 2);
	$cols[] = $col;	
				
	$col = array();	
	$col["name"] = "nStatus";	
	$col["title"] = "Status";
	$col["width"] = "100";
	$col["align"] = "center";	
	$col["dbname"] = "lValue"; 
	$col["editable"] = true;
	$col["edittype"] = "select"; 
	$str = $g->get_dropdown_values("select distinct lValue as k, sName as v from Lists Where lType = 3");
	$col["editoptions"] = array("value"=>":;".$str); 
	$col["formatter"] = "select"; 
	$col["searchoptions"] = array("value"=>":;".$str,"sopt" => array("eq")); 
	$col["stype"] = "select-multiple";
	$cols[] = $col;	
	
	$col = array();	
	$col["name"] = "sErrorMessage";
	$col["title"] = "Error_Message";
	$col["hidden"] = true;
	//$col["width"] = "300";
	//$col["editable"] = true;
	//$col["search"] = false;
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "sSessionID";
	$col["width"] = "0";
	$col["hidden"] = true;
	$col["editrules"] = array("edithidden"=>false);
	$cols[] = $col;
	
	$col = array();	
	$col["name"] = "bPrint";
	$col["width"] = "0";
	$col["hidden"] = true;
	$col["editrules"] = array("edithidden"=>false);
	$cols[] = $col;
	
	$g->set_columns($cols,true);

	// render grid and get html/js output
	$out = $g->render("list1");
	
?>
<?php include('header.php'); ?>

<style>
   .progress { position:relative; width:400px; border: 1px solid #ddd; padding: 1px; border-radius: 3px; height:20px; margin-bottom: 10px;}
   .bar { background-color: #B4F5B4; width:0%; height: 24px; border-radius: 3px; }
   .percent { position:absolute; display:inline-block; top:3px; left:48%; }
   div#jqgh_list1_cb {
    padding: 0;
	}

	div#uniform-cb_list1 {
	    padding: 0;
	}
</style>
    
<!--for phpgrid-->
<link rel="stylesheet" type="text/css" media="screen" href="phpgrid/lib/js/themes/start/jquery-ui.custom.css"></link> 
<link rel="stylesheet" type="text/css" media="screen" href="phpgrid/lib/js/jqgrid/css/ui.jqgrid.css"></link> 


<!--The following areused for the multiple selection filter in grid-->
<link rel="stylesheet" href="phpgrid/bootstrap/css/jquery.multiselect.css">
<link rel="stylesheet" href="phpgrid/bootstrap/css/jquery.multiselect.filter.css">

<?php

//we need to go back to login page is the session was detroyed. 
if ($_SESSION["user_id"] == '') {
	//this is reached usually if the users click the previous button from their internet browser program
	echo "<script>window.location.href = 'login.php";
	echo "'</script>";
}
else{
?>
    <div class="breadcrumb">
        Print Registrants 
    </div>

    <form id="myForm" class="form-horizontal" method="post" >
        <input type="hidden" id="event_name" name="event_name" value="<?php echo $event_name; ?>"/>
        <input type="hidden" id="event_start" name="event_start" value="<?php echo $event_start; ?>"/>
        <input type="hidden" id="event_location" name="event_location" value="<?php echo $event_location; ?>"/>
        <input type="hidden" id="session_id" name="session_id" value="<?php echo $sessionID; ?>"/>
        <input type="hidden" id="user_id" name="user_id" value="<?php echo $_GET["user_id"]; ?>"/>
        <input type="hidden" id="event_id" name="event_id" value="<?php echo $_GET["event_id"]; ?>"/>
        <input type="hidden" id="login_id" name="login_id" value="<?php echo $_SESSION["login_id"]; ?>"/>
        <input type="hidden" id="document_root" name="document_root" value="<?php echo $_SERVER['DOCUMENT_ROOT']; ?>"/>
         
        <div class="row-fluid sortable">
            <div class="box span12">
            	<div class="box-content">
                     <fieldset>
                     	<table>
                        <tr>
                        <td width="80%">
                        	<label>- Select all the records you want to print, select the sorting type and click Print.<br>
                            - You can also filter the grid by using the filter tool bar at the top of the grid.<br>
                            - Double click on a row to access the registrant's information page.<br>
                            <strong><i>- No attendee badge will be printed for exhibitor's main contact</i></strong>
                            </label>
                        </td>
<!--                        <td>
                        	<button type="button" title="Clear Print History" class="btn btn-danger" id="clear_print_history" name="clear_print_history" <?php //echo $clearDisabled; ?> onclick="clearPrintHistory();">Clear Print History</button>&nbsp;&nbsp;
                    
                        </td>-->
                        </tr>
                        </table>
                        <div class="control-group">
                            <?php echo $out; ?> 
                         </div>   
                    </fieldset>                 	                              
                </div>
                
                <div class="box-content">
                    <div style="float: left; padding-left: 20px;">
                    <button type="button" title="Prints the registrant's badge ONLY (NO TICKETS and NO guests, additional registrants and/or booth staff will be printed)" class="btn btn-danger" id="print1" name="print1" onclick="printBadges(1);">Print Badges Only</button>&nbsp;&nbsp;
                    <button type="button" title="Prints the registrant's badge and any applicable tickets (NO guests, additional registrants and/or booth staff will be printed) " class="btn btn-inverse" id="print2" name="print2" onclick="printBadges(2);">Print Badges & Tickets</button>&nbsp;&nbsp;
                    <button type="button" title="Clear Print History" class="btn btn-danger" id="clear_print_history" name="clear_print_history" <?php echo $clearDisabled; ?> onclick="clearPrintHistory();">Clear Print History</button>&nbsp;&nbsp;
                    </div>
                    
                <label class="control-label2" style="width:90px !important;float: left;">Order By</label>
                    <div class="controls" style="margin-left: 0px !important; float: left;">
                        <select id="order_by" name="order_by" required>                                	
                        	<option value="sLastName, sFirstName, sCompany" selected="selected">Last name, First name, Company</option>
                            <option value="sCompany, sLastName, sFirstName" >Company, Last name, First name</option>
                        </select>
                    </div>
                    
                    <label class="control-label2" style="width:90px !important; float: left;">Report:</label>
                    <div class="controls" style="margin-left: 0px !important; float: left;">
                    	<select id="report_select" name="report_select" required>                  
                         	<?php              	
                        		$sql = "SELECT `sName`, `sFileName`, lItemID FROM `ReportsList`  Where lAccountID =";
								$sql = $sql.$_GET["user_id"];
								$sql = $sql." and nStatus = 0 and nType = 1 Order by sName";	
								$result=mysql_query($sql);
								if ($error = mysql_error()) {
									error_log("[".date('d-M-Y H:i:s')." UTC] printreg.php line #".__LINE__." Error: ".$error." query: ".$sql.PHP_EOL, 3, "myphplog.log");
								}
								$temp = "";
								while($rows=mysql_fetch_array($result)){
									$temp = $rows[mysql_field_name($result, 1)];
									
									echo '<option value="'.$temp.'"';
									if ($_SESSION['badgereportid'] == number_format($rows[mysql_field_name($result, 2)],0,".","")){
										echo ' selected="selected" ';
									}
									echo '>'.$rows[mysql_field_name($result, 0)].'</option>'.PHP_EOL;
								}
                            ?>
                        </select>
                    </div>
                    
                	<!--<button type="button" title="Print" class="btn btn-primary" id="print1" name="print1" onclick="printBadges(1);">Print</button>&nbsp;&nbsp;-->
                   
<!--                    <button type="button" title="Prints the registrant's badge, any applicable tickets, any applicable guests, additional registrants and/or booth staff" class="btn btn-info" id="print3" name="print3" onclick="printBadges(3);">Print Badges & Tickets with Guest/Add. Reg./Booth Staff</button>&nbsp;&nbsp;
                    <button type="button" title="Prints only the registrant's badge and also print any applicable guests, additional registrants and/or booth staff (NO TICKETS will be printed)" class="btn btn-warning" id="print4" name="print4" onclick="printBadges(4);">Print Badges (No Tickets) with Guest/Add. Reg/Booth Staff.</button><br><br>-->
<div class="clearfix"></div>              

                     <label class="control-label2" style="width:90px !important">Print Status</label>
                    <div class="controls" style="margin-left: 100px !important">
                    <input class="input-xxlarge" id="progress" name="progress" type="text" value="" readonly/>
                    </div>
                </div>
            </div>
        </div>
        <div class="row-fluid sortable">
            <div class="box span12">
                <div class="box-content">
                	<iframe id="iframeReport" src="" frameborder="0" width="100%" class="myIframe" style="margin: 0px; padding: 0px; height: 600px !important;"></iframe> 
                </div>
            </div><!--/span-->
        </div><!--/row-->        
    </form>
    
    
    <script>
		var lID = 0;
		var regName = '';
		var regEmail = '';
		var lRegID = 0;
		var lHistoryID = 0;
		
		function printBadges(printType){
			//go through selected records
            rows = jQuery("#list1").jqGrid('getGridParam','selarrrow');
            if (rows.length == 0){
                alert ("No records were selected.");
				return 0;
            }
			else if (rows.length > 100){
                alert ("Please select less records. Only 100 records at a time can be selected to print.");
				return 0;
            }
            else{
				if(printType == 3 || printType == 4){
					nGuests = 0;
					for(a=0;a<rows.length;a++)
					{				
						lID = rows[a];
						row=jQuery("#list1").getRowData(rows[a]);
						if (parseFloat(row.lRegisteredAs) <-1) { 
							nGuests = nGuests + 1;	
						}
					}
					
					if (nGuests > 0){
						alert("You cannot select the options to print 'with Guest/Add. Reg./Booth Staff' because you have selected some records that are registered as Guest, Additional Registrant or Booth Staff.");	
						return 0;
					}
				}
				
				var balanceDue= "";
				for(a=0;a<rows.length;a++)
				{				
					lID = rows[a];
					row=jQuery("#list1").getRowData(rows[a]);
					if (parseFloat(row.BalanceDue) > 0) { 
						if (row.lGuestID > 0){
							balanceDue += row.sFirstName + " " + row.sLastName + " guest ID #" + row.lGuestID + "\n";
						}
						else{
							balanceDue += row.sFirstName + " " + row.sLastName + " reg ID #" + row.lRegID + "\n";
						}
					}
				}
				
//				if (balanceDue != ""){
//					alert("Some of the records have balance due.\n" + balanceDue + "\nPlease unselect those records to print badges.");
//					return 0;	
//				}
					
				setSessionVar("order_by",document.getElementById("order_by").value);
				setSessionVar("print_type",printType);
				
                var iframe = document.getElementById('iframeReport');
				iframe.src = "";
			
				document.getElementById("progress").value = "Creating History";
                addHistoryToList();
				
				setSessionVar("query","Update PrintRegTemp set bPrint = 0 where sSessionID ='" + document.getElementById("session_id").value + "'");
				saveData();
				
                for(a=0;a<rows.length;a++)
                {				
					lID = rows[a];
					row=jQuery("#list1").getRowData(rows[a]);
					regName = row.sFirstName + ' ' + row.sLastName; 
					regEmail = row.sEmail;
					lRegID = row.lRegID
					
					document.getElementById("progress").value = "Preparing Data for " + regName;
					
					setSessionVar("query","Update PrintRegTemp set bPrint = 1 where lID = " + lID + " and sSessionID ='" + document.getElementById("session_id").value + "'");
					saveData();
					
					updateRow();
					
					
                }//end of for loop
            }
			
			document.getElementById("progress").value = "Preparing PDF File";
			prepareBadgeData();

			refreshReport();
			document.getElementById("progress").value = "Completed";
			
			setSessionVar("query","Update PrintRegTemp set bPrint = 0 where sSessionID ='" + document.getElementById("session_id").value + "'");
			saveData();
				  
			$('html, body').animate({
        		scrollTop: $("#iframeReport").offset().top
    		}, 1000);
			return 0;	
		}
		
		function wait1() {
		   return 1;
		}
		
		function saveData(){
				var request = $.ajax({
					url: 'savedata.php',
					async: false,
					dataType: "json"
				});
				
				request.done(function( msg ) {
					return 1;
				});
				
				request.fail(function( jqXHR, textStatus ) {
					return 0;
				});	
		}
        
		function prepareBadgeData(){
				var request = $.ajax({
					url: 'prepareBadgeData.php',
					async: false,
					dataType: "json"
				});
				
				request.done(function( msg ) {
					return 1;
				});
				
				request.fail(function( jqXHR, textStatus ) {
					return 0;
				});	
		}
		
        function updateRow(){
			document.getElementById("progress").value = "Updating grid: " + regName;

			var rowData = $('#list1').jqGrid('getRowData', lID);
			rowData.bAlreadyPrinted = 1;
			rowData.nStatus = 1;
			$('#list1').jqGrid('setRowData', lID, rowData);
			
			return 1;//success
        }
        
        function addHistoryToList(){
            var str1 = "Insert INTO  RegPrintHistoryList (lAccountID, lEventID, dtCreatedOn) VALUES (";
            str1 += document.getElementById("user_id").value + ",";
            str1 += document.getElementById("event_id").value + ",";
            str1 += "NOW())";
            setSessionVar("query",str1);
            
            var request = $.ajax({
                    url: 'savedata.php', 
                    async: false,
                    dataType: "json"
                });
                
                request.done(function( msg ) {
                    var len1 = msg.length;
                    var x = len1 - 8;
                    var temp=msg.substring(8,len1);	
                    lHistoryID = parseFloat(temp);	
					setSessionVar("history_id",lHistoryID);
                    return 1;
                });
                
                request.fail(function( jqXHR, textStatus ) {
                    return 0;
                });
        }
        
        function setSessionVar(variable, value){

            var request = $.ajax({
                    url: 'setSession.php',
                    data: "variable=" + variable + "&value=" + value, 
                    async: false,
                    dataType: "json"
                });
                
                request.done(function( msg ) {
                    return 1;
                });
                
                request.fail(function( jqXHR, textStatus ) {
                    return 2;
                });
        }
     
	 	function refreshReport(){
			var iframe = document.getElementById('iframeReport');
			var listReport = document.getElementById('report_select');
			var report_file_name = listReport[listReport.selectedIndex].value;
			var randNum = Math.random().toString(36).substr(2, 5);
			iframe.src = './reportTool/stimulsoft_js/viewer.php?report_name='+ report_file_name + '&user_id=' + document.getElementById('user_id').value + '&event_id=' + document.getElementById('event_id').value + '&session_id=' + document.getElementById('session_id').value+'&p='+randNum;
			
		}
		
		function clearPrintHistory(){
			if (confirm('Are you sure you want to clear the print history?')) {
				setSessionVar("query","Delete from RegPrintHistory where lAccountID =" + document.getElementById("user_id").value + " and lEventID =" + document.getElementById("event_id").value );
				saveData();
				
				setSessionVar("query","Delete from RegPrintHistoryList where lAccountID =" + document.getElementById("user_id").value + " and lEventID =" + document.getElementById("event_id").value );
				saveData();
				
				alert("Print history has been cleared. The page will reload.");
				
				location.reload(true);
			} 			
		}
		
	</script>
    
 
    
				<!-- content ends -->
<?php }?>    


<script>
	var opts = {
	'ondblClickRow': function (id) {
		var row=jQuery("#list1").getRowData(id);
		window.location = 'reginfo.php?user_id=' + document.getElementById('user_id').value + '&event_id=' + document.getElementById('event_id').value + '&regid=' + row.lRegID;
	}
	};
	</script>
<?php include('footer.php'); 

mysql_close($connection);
?>
<script src="phpgrid/lib/js/jqgrid/js/jquery.jqGrid.min.js" type="text/javascript"></script>  
<script src="phpgrid/lib/js/themes/jquery-ui.custom.min.js" type="text/javascript"></script>
<script src="phpgrid/lib/js/jquery.multiselect.js"></script>
<script src="phpgrid/lib/js/jquery.multiselect.filter.js"></script>

<script type="text/javascript" src="js/bowser.min.js"></script>
<script src="phpgrid/lib/js/jqgrid/js/i18n/grid.locale-en.js" type="text/javascript"></script>

