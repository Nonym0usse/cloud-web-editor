var editor = ace.edit("editor");
editor.setTheme("ace/theme/one_dark");
editor.getSession().setMode("ace/mode/php");

$('#languageList').on('change', function () {
    var select = document.getElementById("languageList");
    var newMode = select.options[select.selectedIndex].text;
    editor.session.setMode("ace/mode/" + newMode);
});
$("#submit-btn").click(function () {
    var codeid = document.getElementById("languageList").value;
    var source_code = editor.getSession().getValue();
    $("#final-output").html("<span style='color:white;');>Loading...</span>.");
    $.ajax({
        type: "POST",
        url: "/compile",
        data: { source_code: source_code, codeid: codeid },
        success: function (data) {
            if (data.status == 200) {
                $("#final-output").html("<span style='color:#36e1ff;');>" + data.success + "</span>.");
            } else {
                $("#final-output").html("<span style='color:red;');>" + data.success + "</span>.");
            }
        },
    });
});

$("#submit-clean").click(function () {
    var code = editor.getValue();
    editor.setValue("Write your code here...");
});