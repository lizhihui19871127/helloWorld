define('common:widget/numberUpper/numberUpper.js', function(require, exports, module){ 
var numberUpper = {};
numberUpper.use = {
    "ChangeShareToUpper" : function(value){
        var intFen,i,iPos;
        var strArr,strCheck,strFen,strDW,strNum,strBig,strNow;
        var type = $("#paychannelType").val();
        var unit='Ԫ';
        if('W' == type || 'w' == type){
            unit='��'
        }

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
            return ChangeIntToUpper(value)+unit;
        }
        else if (iPos == 0)
        {
            //����С��
            return "���" + ChangeShareFracToUpper(value.substring(1))+unit;
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
                return ChangeIntToUpper(numA) + "��" + numBBig +unit;
            else
                return ChangeIntToUpper(numA) + unit;
        }
    }
};

function CheckEmpty(strInput)
{
    if (strInput.length <= 0)
        return false;
    return true;
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

module.exports = numberUpper;

 
});