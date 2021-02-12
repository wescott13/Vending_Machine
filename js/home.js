$(document).ready(function () {
    loadItems();
    $('#addMoney').val('0.00').toFixed(2);
    
});

function loadItems() {
    clearItems();
    var contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: 'http://tsg-vending.herokuapp.com/items',
        success: function (itemArray) {
            $.each(itemArray, function (index, item) {
                var itemInfo = '<button class="btn btn-light col-3 border m-4"';
                itemInfo += 'onclick = setItem(' + item.id + ')';
                itemInfo += '<div style="text-align: left">';
                itemInfo += item.id;
                itemInfo += '<br><div style="text-align: center">';
                itemInfo += item.name;
                itemInfo += '<br><br>';
                itemInfo += '$' + item.price.toFixed(2);
                itemInfo += '<br><br><br>'; 
                itemInfo += 'Quantity Left: ' + item.quantity;
                itemInfo += '<br><br>';
                itemInfo += '</div></button>';
                
                contentRows.append(itemInfo);
            });
        },
          
        error: function () {
            $('#message').val('Error getting items.');
        }
    })
};

$('#addDollar').click(function () {
    var total = $('#addMoney').val();
    var newTotal = Number(total) + 1.00;
    $('#addMoney').val(newTotal.toFixed(2));
});
$('#addQuarter').click(function () {
    var total = $('#addMoney').val();
    var newTotal = Number(total) + .25;
    $('#addMoney').val(newTotal.toFixed(2));
});
$('#addDime').click(function () {
    var total = $('#addMoney').val();
    var newTotal = Number(total) + .1;
    $('#addMoney').val(newTotal.toFixed(2));
});
$('#addNickel').click(function () {
    var total = $('#addMoney').val();
    var newTotal = Number(total) + .05;
    $('#addMoney').val(newTotal.toFixed(2));
});

function setItem(itemId) {
    $('#itemId').val(itemId);
    clearMessage();
    clearChange();
}
$('#purchase').click(function () {
    var itemId = $('#itemId').val();
    var money = $('#addMoney').val();

    if (itemId === '') {
        $('#message').val('Please make a selection');
    }
    else
    $.ajax({
        type: 'POST',
        url: 'http://tsg-vending.herokuapp.com/money/' + money + '/item/' + itemId,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'dataType': 'json',
        success: function (item) {    
            loadItems();
            var newTotal = (item.quarters * .25) + (item.dimes * .10) + (item.nickels * .05) + (item.pennies * .01);
            $('#addMoney').val(newTotal.toFixed(2)); 
            //$('#change').val('Quarters: '+ item.quarters + '   Dimes: ' + item.dimes + '  Nickels: ' + item.nickels + '     Pennies: ' + item.pennies);
            changeReturn();
            $('#message').val('Thank you!!');
            $('#addMoney').val(newTotal.toFixed(2));
            var newTotal = 0;
            $('#addMoney').val(newTotal.toFixed(2));
        },
        error: function (item) {
            var messageReturn = jQuery.parseJSON(item.responseText);
            $('#message').val(messageReturn.message);
        }
    })
});

function clearItems() {
    $('#contentRows').empty();
}
function clearMessage() {
    $('#message').val('');    
}
function clearChange() {
    $('#change').val('');   
}
$('#changeReturn').click(function () {
    changeReturn();
    loadItems();
    clearMessage();
    $('#itemId').val('');
    var newTotal = 0;
    $('#addMoney').val(newTotal.toFixed(2));
});

function changeReturn() {
    var total = $('#addMoney').val();
    var message = '';
    var comma = 0;

    quarters = (total / .25).toFixed(2);
    quarters = Math.floor(quarters);
    total = (total - (quarters * .25)).toFixed(2);
    if (quarters === 1) {
        message += '1 Quarter '
        comma = 1
    }
    else if (quarters >= 2) {
        message += quarters + ' Quarters '
        comma = 1
    }

    dimes = (total / .1).toFixed(2);
    dimes = Math.floor(dimes);
    total = (total - (dimes * .10)).toFixed(2);

    if (comma === 1 & dimes > 0) {
        message += ', '
        comma = 0
    }

    if (dimes === 1 & comma === 0) {
        message += '1 Dime'
        comma = 1
    }
    else if (dimes >= 2 & comma === 0) {
        message += dimes + ' Dimes'
        comma = 1
    }
    
    nickels = (total / .05).toFixed(2);
    nickels = Math.floor(nickels);
    total = (total - (nickels * .05)).toFixed(2);

    if (comma === 1 & nickels > 0) {
        message += ', '
        comma = 0
    }
    if (nickels === 1) {
        message += '1 Nickel'
        comma = 1
    }
    else if (nickels >= 2) {
        message += nickels + ' Nickels'
        comma = 1
    }
    
    pennies = (total / .01).toFixed(2);
    pennies = Math.floor(pennies);
    total = (total - (pennies * .01)).toFixed(2);

    if (comma === 1 & pennies > 0) {
        message += ', '
        comma = 0
    }
    if (pennies === 1) {
        message += '1 Penny '
    }
    else if (pennies >= 2) {
        message += pennies + ' Pennies '
    }

    $('#change').val(message);
};



