window.onresize = resize();

function resize()
{
    var heightString = (window.innerHeight/10) + "px";
    //alert(heightString);
    document.getElementById("textContainer").style.height = heightString;
}