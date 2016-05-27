var util = require("common:widget/util/util.js"),
	datepicker = require("common:widget/datepicker/datepicker.js"),
	juicer = require("common:widget/juicer/juicer.js");
	dialog = require("common:widget/dialog/dialog.js");

var main = (function(){

	var bindEvent = function(){

        $("#redeemForm").submit(function(){
            var msg = "";
            var moneyPattern = /^[0-9]+([.]\d{1,2})?$/;
            var _obj = $("#redeemShare").val();
            var allShareValue = $("#allShareValue").val();
            var partreddem = $("#partreddem").val();
            var remainShare = $("#remainShare").val();
            var _fundingSource = $('input:radio[name=_fundingSource]:checked').val();
            if ( _obj== ""){
                msg += "��طݶ��Ϊ�գ�\n";
            }else{
                if (!moneyPattern.exec(_obj)){
                    msg += "��������ȷ��ʽ���˳��ݶ\n";
                }
                else if (_obj <= 0){
                    msg += "�˳��ݶ��������㣡\n";
                }
                else if(_obj>parseFloat(allShareValue)){
                    msg += "�˳��ݶ����С�ڻ���ڵ�ǰ���÷ݶ\n";
                }
                else if(_obj==parseFloat(allShareValue)){
                    //ȫ����أ��ǿ��Եġ�
                }
                else{
                    if(partreddem == "true"){
                        //��������أ����ܳ��������ؽ��
                        if(_obj>parseFloat(remainShare)){
                            msg += "�����˳����ֻ���˳�"+remainShare+"�ݣ�\n";
                        }
                    }else{
                        msg += "Ŀǰʣ��ݶ�㣬�����أ�ֻ��ȫ����أ����ܲ�����ء�";
                    }
                }
            }

            if(msg != ""){
                alert(msg);
                return false;
            }else{
                if(_fundingSource == "2"){
                    //Ǯ���ӣ�����ͨ���
                    $("#redeemForm").attr("action","/trade/RedeemAction.do");
                    $("#method").val("specialwalletToConfirm");
                }else if(_fundingSource == "1"){
                    //��ͨ���п����
                    $("#redeemForm").attr("action","/trade/SpecialRedeemAction.do");
                    $("#method").val("toConfirm");
                }
                return true;
            }
        });

        $('#redeemShare').keyup(function () {
            var _obj = $("#redeemShare").val();
            $("#chinavalue").html(ChangeShareToUpper(_obj));
        });

        $('#redeemShare').change(function () {
            var _obj = $("#redeemShare").val();
            $("#chinavalue").html(ChangeShareToUpper(_obj));
        });

        $('#redeemShare').blur(function () {
            var _obj = $("#redeemShare").val();
            $("#chinavalue").html(ChangeShareToUpper(_obj));
        });

        $("#allShare").click(function(){
            $("#redeemShare").val($("#allShareValue").val());
            $("#chinavalue").html(ChangeShareToUpper($("#redeemShare").val()));
        });

        $("#payLabel1").click(function(){
            $("#payLabel1").removeClass().addClass("payType payType1 active");
            $("#payLabel2").removeClass().addClass("payType payType2");
            $("#tips").css("display","none");
        });

        $("#payLabel2").click(function(){
            $("#payLabel1").removeClass().addClass("payType payType1");
            $("#payLabel2").removeClass().addClass("payType payType2 active");
            $("#tips").css("display","block");
        });

        function CheckEmpty(strInput)
        {
            if (strInput.length <= 0)
                return false;
            return true;
        }

        function CheckLength(strInput, nLen)
        {
            if (strInput.length != nLen)
                return false;
            return true;
        }

        function CheckAlphabetDigit(strInput)
        {
            var nLen = strInput.length;
            var i = 0;
            if (nLen <= 0)
                return false;


            for (i=0;i<nLen;i++)
            {
                if ( !((strInput.charAt(i).toLowerCase() >= 'a' && strInput.charAt(i).toLowerCase() <= 'z') || (strInput.charAt(i) >= '0' && strInput.charAt(i) <= '9')))
                    return false;
            }
            return true;
        }

        function CheckAlphabet(strInput)
        {
            var nLen = strInput.length;
            var i = 0;
            if (nLen <= 0)
                return false;


            for (i=0;i<nLen;i++)
            {
                if (strInput.charAt(i).toLowerCase() < 'a' || strInput.charAt(i).toLowerCase() > 'z')
                    return false;
            }
            return true;
        }

        function CheckChar(strInput,strChar)
        {
            var nLen = strInput.length;
            var i = 0;
            if (nLen <= 0)
                return false;

            for (i=0;i<nLen;i++)
            {
                if (strInput.charAt(i) == strChar)
                    return true;
            }
            return false;
        }

        function CheckDigit(strInput)
        {
            var nLen = strInput.length;
            var i = 0;
            if (nLen <= 0)
                return false;


            for (i=0;i<nLen;i++)
            {
                if (strInput.charAt(i) < '0' || strInput.charAt(i) > '9')
                    return false;
            }
            return true;
        }
        function ConfirmSubmit()
        {
            return confirm(" ȷ���ύ? ");
        }

        /**
         * �����ַ����б�.
         * @param s ��Ҫ�б���ַ���.
         * @return ��sΪ�����ַ���ʱ����true, ��֮����false.
         */
        function isNumberStr(s)
        {
            var n = "0123456789.";
            var i;
            var isF = false;
            var fnum = 0;
            var maxF = 2;//С��λ�����ֵ
            var j = 0;
            if ((s == null) || (s.length == 0 )){
                return false;
            }

            for (i = 0 ; i < s.length ; i++){
                if ( s.charAt(i) == "." ) {
                    isF = true;
                    j++;
                }
                if (isF) {
                    fnum++;
                }
                var c = s.charAt(i);
                if ( ( n.indexOf(c) == -1) || (j > 1) || (fnum - 1 > maxF)){
                    return false;
                }
            }
            return true;
        }
        //�ж��û������Ƿ�������,
        function isDigital(strInput){
            var s =strInput
            //����������������������ʽ
            var patrn=/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
            if (!patrn.exec(s)) {
                return false
            }
            else{
                return true
            }
        }

        /**
         * �����ַ����б�.
         * @param s ��Ҫ�б���ַ���.
         * @return ��sΪ�����ַ���ʱ����true, ��֮����false.
         */
        function isNumberStr(s)
        {
            var n = "0123456789.";
            var i;
            var isF = false;
            var fnum = 0;
            var maxF = 2;//С��λ�����ֵ
            var j = 0;
            if ((s == null) || (s.length == 0 )){
                return false;
            }

            for (i = 0 ; i < s.length ; i++)
            {
                if ( s.charAt(i) == "." )
                {
                    isF = true;
                    j++;
                }
                if (isF)
                {
                    fnum++;
                }
                var c = s.charAt(i);
                if ( ( n.indexOf(c) == -1) || (j > 1) || (fnum - 1 > maxF))
                {
                    return false;
                }
            }
            return true;
        }

        // �õ�.��λ��
        function GetDotPos(value)
        {
            var j,i,nPos;
            var isZero;

            nPos = -1;
            for (i = 0 ; i < value.length ; i++)
            {
                if ( value.charAt(i) == "." )
                {
                    nPos = i;
                    break;
                }
            }
            return nPos;
        }

        // �õ���Ӧ���ֵĴ�д
        function GetNumUpper(value)
        {
            var strNum = "";
            switch (value)              //ѡ������
            {
                case "1":strNum = "Ҽ";break;
                case "2":strNum = "��";break;
                case "3":strNum = "��";break;
                case "4":strNum = "��";break;
                case "5":strNum = "��";break;
                case "6":strNum = "½";break;
                case "7":strNum = "��";break;
                case "8":strNum = "��";break;
                case "9":strNum = "��";break;
                case "0":strNum = "��";break;
            }
            return strNum;
        }

        // �õ�����λ����Ӧ�Ĵ�д��λ
        function GetIntPosUnit(type,postion)
        {
            var strDW = "";

            if (type==0)
            {// 10000����
                switch(postion)              //ѡ��λ
                {
                    case 1:strDW = "";break;    // ��
                    case 2:strDW = "ʰ";break;  // ʮ
                    case 3:strDW = "��";break;  // ��
                    case 4:strDW = "Ǫ";break;  // ǧ
                    default: strDW = "";break;
                }
            }
            else if (type==1)
            {// 10000�ı��� //TODO:�ٴ�Ͳ�֪����ô������
                switch(postion)              //ѡ��λ
                {
                    case 1:strDW = "";break;
                    case 2:strDW = "��";break;
                    case 3:strDW = "��";break;
                    case 4:strDW = "��";break;
                    default: strDW = "";break;
                }
            }

            return strDW;
        }

        function GetDecFracPosUnit(postion)
        {
            var strDW = "";

            switch(postion)
            {
                case 1:strDW = "��";break;
                case 2:strDW = "��";break;
                case 3:strDW = "��";break;
                default: strDW = "";break;
            }

            return strDW;
        }

        //���ֽ��ת���Ҵ�д��js��
        function ChangeValueToUpper(value)
        {
            var intFen,i,iPos;
            var strArr,strCheck,strFen,strDW,strNum,strBig,strNow;

            // Ϊ��
            if(!CheckEmpty(value))
                return "";

            // ������
            if (!isNumberStr(value))   //���ݷǷ�ʱ��ʾ�������ؿմ�
            {
                strErr = value+"������Ч���֣�"
                return strErr;
            }

            iPos = GetDotPos(value);
            if (iPos < 0 )
            {
                // ��ȫ����
                return ChangeIntToUpper(value)+"Ԫ��";
            }
            else if (iPos == 0)
            {
                //����С��
                return ChangeValueFracToUpper(value.substring(1));
            }
            else
            {
                //����С�����
                var numA, numB;

                strArr = value.split(".");
                numA = strArr[0];
                numB = strArr[1];

                if(numA.length>12)   //���ݴ��ڵ���һ����ʱ��ʾ�޷�����
                {
                    strErr = value+"�����޷�����"
                    return strErr;
                }

                return ChangeIntToUpper(numA) + "Ԫ" + ChangeValueFracToUpper(numB);
            }
        }

        //���ַݶ�ת��д��js��
        function ChangeShareToUpper(value)
        {
            var intFen,i,iPos;
            var strArr,strCheck,strFen,strDW,strNum,strBig,strNow;

            // Ϊ��
            if(!CheckEmpty(value))
                return "";

            // ������
            if (!isNumberStr(value))   //���ݷǷ�ʱ��ʾ�������ؿմ�
            {
                strErr = value+"������Ч���֣�"
                return strErr;
            }

            iPos = GetDotPos(value);
            if (iPos < 0 )
            {
                // ��ȫ����
                return ChangeIntToUpper(value)+"��";
            }
            else if (iPos == 0)
            {
                //����С��
                return "���" + ChangeShareFracToUpper(value.substring(1))+"��";
            }
            else
            {
                //����С�����
                var numA, numB;

                strArr = value.split(".");
                numA = strArr[0];
                numB = strArr[1];

                if(numA.length>12)   //���ݴ��ڵ���һ����ʱ��ʾ�޷�����
                {
                    strErr = value+"�����޷�����"
                    return strErr;
                }

                var numBBig = ChangeShareFracToUpper(numB);

                if (numBBig.length != 0)
                    return ChangeIntToUpper(numA) + "��" + numBBig + "��";
                else
                    return ChangeIntToUpper(numA) + "��";
            }
        }

        // ���������֣�ת���ɴ�д
        function ChangeIntToUpper(inputNum)
        {
            //alert(inputNum);
            if (parseInt(inputNum) == 0)
                return GetNumUpper('0');

            var subsNum = Math.ceil(inputNum.length/4);
            var beforNum = inputNum.length % 4;

            var substr = new Array(subsNum);

            var i=0,j=0;
            var iPos = 0;
            var sOut = "";
            var isZero = false;
            for (i=0; i<subsNum; i++)
            {
                if (i==0 && beforNum != 0)
                {
                    substr[i] = inputNum.substr(0,beforNum);
                    iPos += beforNum;
                }
                else
                {
                    substr[i] = inputNum.substr(iPos,4);
                    iPos += 4;
                }

                // alert("��"+i+ "��(" +subsNum+")" + substr[i]);
                var subStrLen = substr[i].length;
                for(j=0;j<subStrLen; j++)
                {
                    if (substr[i].charAt(j) != '0')
                    {
                        if (isZero)
                        {
                            isZero = false;
                            sOut += GetNumUpper('0');
                        }
                        sOut += GetNumUpper(substr[i].charAt(j)) + GetIntPosUnit(0,subStrLen-j);
                    }
                    else
                        isZero = true;

                }

                if (parseInt(substr[i]) != 0)
                    sOut += GetIntPosUnit(1,subsNum-i);
                //alert("��"+i+ "��(" +subsNum+")" + sOut);
            }

            return sOut;
        }

        // �����С������ת��Ϊ��д
        function ChangeValueFracToUpper(inputNum)
        {
            var iLen,i;
            var isZero = false;
            var sOut="";

            //alert(inputNum);
            iLen = inputNum.length;
            for (i=0; i<iLen; i++)
            {
                if (inputNum.charAt(i) != "0")
                {
                    if (isZero)
                    {
                        isZero = false;
                        sOut += GetNumUpper('0')
                    }
                    sOut += GetNumUpper(inputNum.charAt(i)) + GetDecFracPosUnit(i+1);
                }
                else
                    isZero = true;
            }
            return sOut;
        }

        function ChangeShareFracToUpper(inputNum)
        {
            // ��������Ϊ������
            var sInputNum = "";

            var iLen,i;
            var isZero = true;
            iLen = inputNum.length;
            for (i=iLen; i>0; i--)
            {
                if (inputNum.charAt(i-1) == '0')
                {
                    if (!isZero)
                    {
                        sInputNum = inputNum.charAt(i-1) + sInputNum;
                    }
                }
                else
                {
                    sInputNum = inputNum.charAt(i-1) + sInputNum;
                    isZero = false;
                }
            }

            if (sInputNum.length == 0)
            {
                return "";
            }

            var sOut="";

            iLen = sInputNum.length;
            for (i=0; i<iLen; i++)
            {
                sOut += GetNumUpper(sInputNum.charAt(i));
            }
            return sOut;
        }
    }

    return {
		bindEvent:bindEvent
    }
})();

$(function(){
	main.bindEvent();
});
