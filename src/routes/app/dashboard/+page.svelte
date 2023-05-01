<script lang="ts">
import { onMount } from "svelte";
import NavButton from "$lib/components/atoms/NavButton.svelte";
import Sidebar from "$lib/components/organisms/Sidebar.svelte";

let tableData = Array.from({ length: 5 }, () => Array(5).fill(""));
let tableRef: any;
let selectedCells: any;
let mouseDown = false;
let startCell, endCell;

onMount(() => {
    tableRef.addEventListener("paste", handlePaste);
    tableRef.addEventListener('mousedown', handleMouseDown);
    tableRef.addEventListener('mouseup', handleMouseUp);
    tableRef.addEventListener('mouseover', handleMouseOver);
    tableRef.addEventListener('paste', handlePaste);  

    return () => {
      tableRef.removeEventListener('mousedown', handleMouseDown);
      tableRef.removeEventListener('mouseup', handleMouseUp);
      tableRef.removeEventListener('mouseover', handleMouseOver);
      tableRef.removeEventListener('paste', handlePaste);
    };
});



function handlePaste(e) {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("text");
    const rows = clipboardData.split("\n").map((row) => row.split("\t"));
    for (let i = 0; i < Math.min(rows.length, tableData.length); i++) {
      for (let j = 0; j < Math.min(rows[i].length, tableData[i].length); j++) {
      tableData[i][j] = rows[i][j];
    }
}
}

function handleMouseDown(e) {
    if (e.target.tagName === 'TD') {
      mouseDown = true;
      startCell = e.target;
      selectedCells.clear();
      selectedCells.add(startCell);
      updateSelection();
    }
  }

  function handleMouseUp(e) {
    mouseDown = false;
  }

  function handleMouseOver(e) {
    if (mouseDown && e.target.tagName === 'TD') {
      endCell = e.target;
      updateSelection();
    }
  }

  function updateSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells.clear();

    const startRow = startCell.parentNode.rowIndex;
    const startCol = startCell.cellIndex;
    const endRow = endCell.parentNode.rowIndex;
    const endCol = endCell.cellIndex;

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    for (let i = minRow; i <= maxRow; i++) {
      for (let j = minCol; j <= maxCol; j++) {
        const cell = tableRef.rows[i].cells[j];
        cell.classList.add('selected');
        selectedCells.add(cell);
      }
    }
  }
</script>

<div id="editor" />

<div>
  <table bind:this={tableRef}>
    {#each tableData as row, i}
      <tr>
        {#each row as cell, j}
          <td contenteditable>{cell}</td>
        {/each}
      </tr>
    {/each}
  </table>
</div>

<style>
  table {
    border-collapse: collapse;
    margin: 20px;
  }
  th,
  td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }
</style>
