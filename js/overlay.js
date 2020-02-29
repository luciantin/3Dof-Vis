/////////////////////////////////////////
////////         Overlay        /////////
/////////////////////////////////////////

let overlayHTML = document.querySelector('.overlay');
let overlayContentHTML = document.querySelector('.overlay-content');
let headerMenuBtnAboutHTML = document.getElementById('header-about');
let overlayTablesHTML = document.querySelector('.overlay-tables');


headerMenuBtnAboutHTML.addEventListener('click', OverlayToggle);
overlayHTML.addEventListener('click',OverlayToggle);

function OverlayToggle(){ overlayHTML.classList.toggle('hide'); }





let tables = `
<table class="table-theme-light mx-2">
    <tr>
        <td>Com</td>
        <td>Direction</td>
        <td></td>
        <td>Com</td>
        <td>Memory</td>
    </tr>
    <tr>
        <td>RUP</td>
        <td>row up</td>
        <td></td>
        <td>CPA</td>
        <td>copy A -&gt; B</td>
    </tr>
    <tr>
        <td>RDW</td>
        <td>row down</td>
        <td></td>
        <td>CPB</td>
        <td>copy B -&gt; A</td>
    </tr>
    <tr>
        <td>RLF</td>
        <td>row left</td>
        <td></td>
        <td>SWP</td>
        <td>swap A &lt;-&gt; B</td>
    </tr>
    <tr>
        <td>RRT</td>
        <td>row right</td>
        <td></td>
        <td>NEA</td>
        <td>next A</td>
    </tr>
    <tr>
        <td>PUP</td>
        <td>page up</td>
        <td></td>
        <td>PEA</td>
        <td>prev A</td>
    </tr>
    <tr>
        <td>PDW</td>
        <td>page down</td>
        <td></td>
        <td>NEB</td>
        <td>next B</td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>PEB</td>
        <td>prev B</td>
    </tr>
</table>

<table class="table-theme-light mx-2">
    <tr>
        <td>Com</td>
        <td>Flow Control</td>
        <td></td>
        <td>Com</td>
        <td>I/O</td>
    </tr>
    <tr>
        <td>CAZ</td>
        <td>A == 0 ?</td>
        <td></td>
        <td>OIA</td>
        <td>out int A</td>
    </tr>
    <tr>
        <td>CBZ</td>
        <td>B == 0 ?</td>
        <td></td>
        <td>OIB</td>
        <td>out int B</td>
    </tr>
    <tr>
        <td>CAL</td>
        <td>A &gt; B  ?</td>
        <td></td>
        <td>IIA</td>
        <td>in  int A</td>
    </tr>
    <tr>
        <td>CBL</td>
        <td>B &gt; A  ?</td>
        <td></td>
        <td>IIB</td>
        <td>in  int B</td>
    </tr>
    <tr>
        <td>CIE</td>
        <td>A == B ?</td>
        <td></td>
        <td>OAA</td>
        <td>out ascii A</td>
    </tr>
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td>OAB</td>
        <td>out ascii B</td>
    </tr>
</table>

<table class="table-theme-light mx-2">
    <tr>
        <td>Com</td>
        <td>A</td>
        <td>Combination  (x - reg)</td>
        <td>B</td>
        <td>Com</td>
    </tr>
    <tr>
        <td>REA</td>
        <td></td>
        <td>reset to 0</td>
        <td></td>
        <td>REB</td>
    </tr>
    <tr>
        <td>ADA</td>
        <td></td>
        <td>A + B save in  X</td>
        <td></td>
        <td>ADB</td>
    </tr>
    <tr>
        <td>AOA</td>
        <td></td>
        <td>add one to X</td>
        <td></td>
        <td>AOB</td>
    </tr>
    <tr>
        <td>SBA</td>
        <td></td>
        <td>A - B save in X</td>
        <td></td>
        <td>SAB</td>
    </tr>
    <tr>
        <td>SOA</td>
        <td></td>
        <td>sub one from X</td>
        <td></td>
        <td>SOB</td>
    </tr>
</table>

<table class="table-theme-light mx-2">
    <tr>
        <td>Com</td>
        <td>Other</td>
    </tr>
    <tr>
        <td>STP</td>
        <td>row stop</td>
    </tr>
    <tr>
        <td>STO</td>
        <td>prog stop</td>
    </tr>
    <tr>
        <td>NOP</td>
        <td>noop</td>
    </tr>
</table>
`;






overlayTablesHTML.innerHTML = tables;
