window.onclick = remove_bubble;
window.onmove = remove_bubble;
var bubbleOpened = false;

function toggle(source, textTarget)
{
    //source = clicked object
    //target = opposite of the source's origin
    //variable storing the origin of the clicked source
    var textSource;
    
    if(textTarget == 'slovo')
        textSource = 'molenie';
    else if(textTarget == 'molenie')
        textSource = 'slovo';
    else
        alert('ERROR');
        
    //makes the target gnome appear with two surrounding gnomes
    clear_texts(textSource);
    show_context(source, textSource);
    
    //makes the correlating gnomes in the opposite miscellany appear, as well as the sources of both
    clear_texts(textTarget);
    show_correlating_gnomes(source, textSource, textTarget);
}
function numToggle(zIndex, textSource)
{
    var textTarget;
    var gnome = document.getElementById(textSource).getElementsByClassName(zIndex)[0];
    if(textSource == 'slovo')
    {
        textTarget = 'molenie';
    }
    else if(textSource == 'molenie')
    {
        textTarget = 'slovo';
    }
    toggle(gnome, textTarget);
    
}

function show_context(source, textSource)
{   
    var chapter = source.parentNode;
    chapter.style.display="block";
    
    show_targets(source, textSource);
}

function show_correlating_gnomes(source, textSource, textTarget)
{   
    var mappingList = document.getElementById('mappings');
    var zIndex = source.getAttribute('class');
    var mappingClass = textSource + zIndex; //Creates a string like slovo23 or molenie5

    var mappings = mappingList.getElementsByClassName(mappingClass);
    //grabs all correlating gnomes
    
    if(mappings.length > 0) //skips work if there aren't any correlating gnomes
    {
        show_correlating_lines(source); //increases the opacity of the lines with the correct correlation
        show_numbers(zIndex, textSource, mappings); //emphasize the correlating SVG text
        show_sources(zIndex, textSource, textTarget, mappings);
    
        document.getElementById(textTarget + 'Empty').style.display="none"; //hide the No Matches Found message
        
        for(var index = 0; index < mappings.length; index++)//iterates through correlating gnomes
        {   
            var targetClass = Number(mappings[index].firstElementChild.textContent);
            
            var targets = document.getElementById(textTarget).getElementsByClassName(targetClass);
            for(var subIndex = 0; subIndex < targets.length; subIndex++)
            {
                show_context(targets[subIndex], textTarget);
            }
            
            if(index > 0) //tests that the current iteration is not on the first gnome
            { var prevTargetClass = Number(mappings[index-1].firstElementChild.textContent); } //grabs the previous gnome
            
            if(prevTargetClass == (targetClass - 1)) //tests if the previous correlating gnome is adjacent, and accounts for that positioning by redoing the visual emphasis
            {
                var prevTargets = document.getElementById(textTarget).getElementsByClassName(prevTargetClass);
                for(var subIndex2 = 0; subIndex2 < prevTargets.length; subIndex2++)
                {
                    emphasize(prevTargets[subIndex2]);
                }
            }
        }
    }
    else
    {
        document.getElementById(textTarget + 'Empty').style.display="block";
        fade_plectogram();
        show_num_if_empty(zIndex, textSource);
    }
}

function show_targets(source, textSource)
{   
    var zIndex = source.getAttribute('class');
    emphasize(source);
    
    //grabs the gnome's name, which is its number in its respective text source (slovo or molenie)
    //it is then used to display its neighboring gnomes
    if(source.nextElementSibling)
    {
        var next = source.nextElementSibling;
        normalize(next);
    }
    else if(source.parentNode.nextElementSibling)
    {
        //Go 2 elements deep because the first element is always the heading, which is never display-none'd
        var next = source.parentNode.nextElementSibling.firstElementChild.nextElementSibling;
        source.parentNode.nextElementSibling.style.display="block";
        if(next.getAttribute('class') == zIndex)
        {
            emphasize(next);
            if(next.nextElementSibling)
            {
                normalize(next.nextElementSibling);
            }
        }
        else
        {
            normalize(next);
            if(!next.nextElementSibling) //any gnome split across chapters won't have a nextElementSibling (we want to include these split gnomes in the context however)
            {
                if(next.parentNode.nextElementSibling) //tests if it is the end of the gnome list
                {
                    if(next.parentNode.nextElementSibling.firstElementChild.nextElementSibling.getAttribute('class') == next.getAttribute('class')) //checks if the gnome was split (the two gnomes would have equal class values)
                    {
                        next.parentNode.nextElementSibling.style.display="block";
                        normalize(next.parentNode.nextElementSibling.firstElementChild.nextElementSibling);
                    }
                }
            }
        }
    }
    
    //***All gnomes will have a previous Element, either a gnome or a header, so a conditional isn't needed
        var previous = source.previousElementSibling;
        if(previous.tagName == 'H2')
        {
            //This conditional will only fail if it is in Chapter 0
            if(previous.parentNode.previousElementSibling.tagName != "HR")
            {
                previous.parentNode.previousElementSibling.style.display="block";
                previous = previous.parentNode.previousElementSibling.lastElementChild;
                if(previous.getAttribute('class') != zIndex)
                {
                    normalize(previous);
                }
                else
                {
                    show_context(previous);
                }
            }
        }
        else
        {
            normalize(previous);
        }
}

function clear_texts(textSource)
{
    var miscellany = document.getElementById(textSource);
    var chapterList = miscellany.getElementsByClassName("cd");
    
    for(var index = 0; index < chapterList.length; index++)
    { // hey, the variable is called "index"!
        chapterList[index].style.display = "none";
    }
    
    var gnomeList = miscellany.getElementsByTagName("p");
    
    for(var index = 0; index < gnomeList.length; index++)
    { // hey, the variable is called "index"!
        gnomeList[index].style.display = "none";
    }
}

function clear_chapter(chapter)
{
    var gnomes = chapter.childElementCount;
    var currentGnome = chapter.firstElementChild.nextElementSibling;
    
    for(var index = 1; index < gnomes; index++)
    {
        currentGnome.style.display="none";
        currentGnome = currentGnome.nextElementSibling;
    }
}

function showall()
{   
    show('slovo');
    show('molenie');
    clear_sources();
}
function show(textSource)
{
    var miscellany = document.getElementById(textSource);
    var chapterList = miscellany.children;
    
    for(var index = 0; index < chapterList.length; index++)
    {
        chapterList[index].style.display="block";
    }
    
    var gnomeList = miscellany.getElementsByTagName("p");
    
    for(var index = 0; index < gnomeList.length; index++)
    {
        normalize(gnomeList[index]);
    }
    
    document.getElementById(textSource + 'Empty').style.display="none";
    reset_plectogram();
}

function normalize(gnome)
{
    gnome.style.display = "block";
    gnome.style.fontStyle = "normal";
    gnome.style.color = "black";
}
function emphasize(gnome)
{
    gnome.style.display = "block";
    gnome.style.fontStyle = "italic";
    gnome.style.color = "#A00000";
}

function show_correlating_lines(source)
{
    var mappingList = document.getElementById('mappings');
    var zIndex = source.getAttribute('class');
    var plectogram = document.getElementById('plectogram');
    
    var lineList = plectogram.getElementsByTagName("line");
    
    if(source.parentNode.parentNode.id == "slovo")
    {
        for(var index = 0; index < lineList.length; index++)
        {
            if(lineList[index].getAttribute('slovo') == zIndex)
            {
                lineList[index].style.opacity = 1;
                lineList[index].style.stroke="A00000";
            }
            else
            {
                lineList[index].style.opacity = .1;
                lineList[index].style.stroke="black";
            }
        }
    }
    else if(source.parentNode.parentNode.id == "molenie")
    {
        for(var index = 0; index < lineList.length; index++)
        {
            if(lineList[index].getAttribute('molenie') == zIndex)
            {
                lineList[index].style.opacity = 1;
                lineList[index].style.stroke="A00000";
            }
            else
            {
                lineList[index].style.opacity = .1;
                lineList[index].style.stroke="black";
            }
        }
    }
}
function reset_plectogram()
{
    reset_lines();
    reset_nums();
}
function reset_lines()
{
    var plectogramLines = document.getElementById('plectogram').getElementsByTagName("line");
        for(var index = 0; index < plectogramLines.length; index++)
        {
            plectogramLines[index].style.opacity = .2;
            plectogramLines[index].style.stroke="black";
        }
}
function reset_nums()
{
    var plectogramNums = document.getElementById('plectogram').getElementsByTagName("text");
        for(var index = 0; index < plectogramNums.length; index++)
        {
            plectogramNums[index].style.stroke="none";
            plectogramNums[index].style.opacity="1.0";
        }
}
function fade_plectogram()
{
    fade_lines();
    fade_nums();   
}
function fade_lines()
{
    var plectogramLines = document.getElementById('plectogram').getElementsByTagName("line");
        for(var index = 0; index < plectogramLines.length; index++)
        {
            plectogramLines[index].style.opacity =.1;
            plectogramLines[index].style.stroke="black";
        }
}
function fade_nums()
{
    var plectogramNums = document.getElementById('plectogram').getElementsByTagName("text");
        for(var index = 0; index < plectogramNums.length; index++)
        {
            plectogramNums[index].style.stroke="none";
            plectogramNums[index].style.opacity=".5";
        }
}

function show_num_if_empty(zIndex, textSource)
{
    var plectogram = document.getElementById('plectogram');
    var nums = plectogram.getElementsByTagName('text');
    
    if(textSource=="slovo")
    {
        nums[zIndex].style.stroke="#A00000";
        nums[zIndex].style.opacity="1";
    }
    else if(textSource=="molenie")
    {
        nums[Number(Number(zIndex) + 49)].style.stroke="A00000";
        nums[Number(Number(zIndex) + 49)].style.opacity="1";
    }
}

function show_numbers(zIndex, textSource, mappings)
{
    reset_nums();
    var plectogram = document.getElementById('plectogram');
    var nums = plectogram.getElementsByTagName('text');
    
    //iterates through first 49 elements, the slovo numbers
    if(textSource == "slovo")
    {
        for(var index = 0; index < 49; index++)
        {
            if(Number(nums[index].textContent) == zIndex)
            {
                nums[index].style.stroke="#A00000";
                nums[index].style.opacity="1.0";
            }
            else
            {
                nums[index].style.opacity=".5";
            }
        }
        
        var mapIndex = 0;
        for(var index = 49; index < nums.length; index++)
        {
            if(mapIndex < mappings.length)
            {
                if(nums[index].textContent == mappings[mapIndex].firstElementChild.textContent)
                {
                    nums[index].style.stroke="#A00000";
                    nums[index].style.opacity="1.0";
                    mapIndex++;
                }
                else
                {
                    nums[index].style.opacity=".5";
                }
            }
            else
            {
                nums[index].style.opacity=".5";
            }
        }
    }
    else if(textSource == "molenie")//the molenie is the sourceText
    {
        var mapIndex = 0;
        for(var index = 0; index < 49; index++)
        {
            if(mapIndex < mappings.length)
            {
                if(nums[index].textContent == mappings[mapIndex].firstElementChild.textContent)
                {
                    nums[index].style.stroke="#A00000";
                    nums[index].style.opacity="1.0";
                    mapIndex++;
                }
                else
                {
                    nums[index].style.opacity=".5";
                }
            }
            else
            {
                nums[index].style.opacity=".5";
            }
        }
        
        for(var index = 49; index < nums.length; index++)
        {
            if(Number(nums[index].textContent) == zIndex)
            {
                nums[index].style.stroke="#A00000";
                nums[index].style.opacity="1.0";
            }
            else
            {
                nums[index].style.opacity=".5";
            }
        }
    }
}

function show_sources(zIndex, textSource, textTarget, mappings)
{
    clear_sources();
    var sourceBib = document.getElementById(textSource + "-sources");
    var targetBib = document.getElementById(textTarget + "-sources");
    
    var listing = sourceBib.getElementsByClassName(String(zIndex));
    if(listing[0])
    {
        listing[0].style.display="block";
    }
    
    for(var index = 0; index < mappings.length; index++)
    {
        listing = targetBib.getElementsByClassName(String(mappings[index]));
        if(listing[0])
        {
            alert(index);
            listing[0].style.display="block";
        }
    }
}
function clear_sources()
{
    var slovoBibListings = document.getElementById("slovo-sources").children;
    var molenieBibListings = document.getElementById("molenie-sources").children;
    
    for(var index = 0; index < slovoBibListings.length; index ++)
    {
        slovoBibListings[index].style.display="none";
    }
    for(var index = 0; index < molenieBibListings.length; index ++)
    {
        molenieBibListings[index].style.display="none";
    }
    
}

function show_bubble(target)
{
    var isBubbleParent = false;
    if(document.getElementById("source_bubble"))
    {
        if(document.getElementById("source_bubble").innerHTML == target.firstElementChild.innerHTML)
        {
            isBubbleParent = true;
        }
        bubbleOpened = false;
        remove_bubble();
    }
    
    if(!isBubbleParent)
    {
        var span = target.getElementsByClassName("sourceText")[0];
        span.style.position="fixed";
        var x = Number(target.offsetLeft);
        var y = Number(target.parentElement.offsetTop);
        span.style.left = x;
        span.style.bottom = y;
        span.setAttribute("id", "source_bubble");
        span.style.visibility="hidden";
        span.style.display="block";
        span.style.whiteSpace="normal";
        if((span.offsetLeft + span.offsetWidth) > document.documentElement.clientWidth)
        {
            var left = Number(Number(document.documentElement.clientWidth) - Number(span.offsetWidth));
            if(left >= 0)
            {
                span.style.left = left + "px";
            }
            else
            {
                span.style.left = 0 + "px";
                span.style.width = document.documentElement.clientWidth + "px";
            }
        }
        span.style.visibility="visible";
        target.appendChild(span);
    
        bubbleOpened = true;
    }
}

function remove_bubble()
{
    if(bubbleOpened == true)
    {
        bubbleOpened = false;
    }
    else if(bubbleOpened == false)
    {
        if(document.getElementById("source_bubble"))
        {
            var bubble = document.getElementById("source_bubble");
            bubble.setAttribute("id", "");
            bubble.style.display="none";
        }
    }
}
/*  Goal being to create a recursive deep tree-traveling function
function clear_deep(source)
{
    if(source.children)
    {
        for(var index = 0; index < source.children.length; index++)
        {
            clear_deep(source.children[index]);
        }
    }
    else
    {
        source.style.display="none";
        source.style.fontStyle="normal";
    }
}
*/