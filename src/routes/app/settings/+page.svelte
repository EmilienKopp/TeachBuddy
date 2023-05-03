<script lang="ts">
    import type { PageData } from "./$types";
    import { superForm } from "sveltekit-superforms/client";
    import { XSVto2dArray, XSVtoObjectArray } from "$lib/helpers/Text";
    import Select from "$lib/components/atoms/Select.svelte";
    import { deleteColumn } from "$lib/helpers/Arrays";
    import type { TableSource } from "@skeletonlabs/skeleton";
    import UnderConstruction from "$lib/components/atoms/UnderConstruction.svelte";
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

    export let data: PageData;

    console.log('Vocab Columns', data.vocabColumns);

    let loading: boolean = false;

    let fileInput: any;
    let fileName: string;
    let fileData: any;
    let filePreview: Array<any> = [];
    let columnHeaders: Array<string> = [];
    let delimiter = ','; // default delimiter
    let sourceData;
    let tableSimple: TableSource = {
        head: [],
        body: [],
    };

    const { form, enhance, reset, errors, constraints, validate } = superForm(data.form, {
        dataType: 'json',
        applyAction: true,
        resetForm: false,
        invalidateAll: true,
        onUpdated: ({ form }) => { loading = false; console.log('Loading:',loading) },
    });

    const handleFileChange = (event: Event) => {
        const file: File = event?.target?.files[0];
        fileName = file.name;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e?.target?.result;
                delimiter = file.name.endsWith('.tsv') ? '\t' : ',';

                fileData = XSVto2dArray(content, delimiter);
                console.log('File Data', fileData);
                $form.vocabData = JSON.stringify(fileData);

                columnHeaders = fileData[0].filter((header: string) => header.trim() != '');
                console.log('Column Headers', columnHeaders);
            };
            reader.readAsText(file);
        }
    };

    const columnDeletionHandler = (index: number) => {

        fileData = deleteColumn(fileData,index);
        columnHeaders.splice(index,1); 
        columnHeaders = [...columnHeaders]
        $form.columnHeaders.splice(index,1);
        $form.columnHeaders = [...$form.columnHeaders];
    }

    const resetFileInput = () => {
        fileInput.value = null;
        fileName = '';
        filePreview = columnHeaders = [] ;
    }

    $: {
        $form.vocabData = JSON.stringify(fileData);
    }

</script>

<UnderConstruction />

<div id="settings" class="w-full h-full p-16 bg-inherit">

    <h1 class="mb-6">Options</h1>

    <form method="POST" use:enhance>
        <input type="hidden" bind:value={$form.vocabData} name="vocabData"/>
        <div class="grid grid-cols-3">
            <!-- Inputs -->
            <div class="mx-2">
                <label for="gradeVocabList" class="label">Update Grade Vocab List</label>
                <input name="gradeVocabList" class="input"
                    type="file"
                    accept=".csv,.tsv"

                    on:change="{handleFileChange}" />
            </div>

            <div class="mx-2">
                <label for="frequencyVocabList" class="label">Update Frequency Vocab List</label>
                <input name="frequencyVocabList" class="input"
                    type="file"
                    accept=".csv,.tsv"
                    bind:this="{fileInput}"
                    bind:value="{fileInput.files[0]}"
                    on:change="{handleFileChange}" />
            </div>

            <div class="mx-2">
                <label for="sentencesList" class="label">Update Sentences</label>
                <input name="sentencesList" class="input"
                    type="file"
                    accept=".csv,.tsv"
                    on:change="{handleFileChange}" />
            </div>

            {#if fileName}
            <h3> {fileName} </h3>
            <button type="button" on:click={resetFileInput}>Reset</button>
            <button type="submit">Register</button>
            {/if}

            <!-- Preview -->
            <div class="table-container w-full mt-4 col-span-3">
                {#if fileData}
                <table class="table table-hover">
                    <thead>
                        <tr>
                            {#each columnHeaders as header, index}
                            <th>
                                <label for="columnNames[{header}]">{header.length > 0 ? header : 'N/A'}</label>
                                <Select name="columnHeaders[{index}]" data={data.vocabColumns} bind:value={ $form.columnHeaders[index] }/>
                                <button type="button" on:click={() => { columnDeletionHandler(index) } }>X</button>
                            </th>
                            {/each}
                        </tr>
                    <tbody>
                    {#each fileData.slice(0,15) as row, rowIndex}
                        {#if rowIndex}
                        <tr>
                            {#each row as cell, cellIndex}
                                <td>{cell}</td>
                            {/each}
                        </tr>
                        {/if}
                        
                    {/each}
                    <tr>
                        <td colspan="999" align="center" class="text-3xl">...</td>
                    </tr>
                    </tbody>
                </table>
                {/if}
            </div>
        </div>
    </form>

</div>
