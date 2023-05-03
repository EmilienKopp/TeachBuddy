<script lang="ts">
    import UnderConstruction from '$lib/components/atoms/UnderConstruction.svelte';
    import type { PageData } from './$types';
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

    export let data: PageData;

    console.log(data);
</script>

<UnderConstruction />

<section class="mt-12 p-2">
    <Table striped={true}>
        <TableHead>
            <TableHeadCell>English</TableHeadCell>
            <TableHeadCell>日本語（既定）</TableHeadCell>
            <TableHeadCell>日本語<br/>（カスタム）</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each data.vocabData as item, key}
                <TableBodyRow>
                    <TableBodyCell>{item.vocabulary.en_word}</TableBodyCell>
                    <TableBodyCell>{item.vocabulary.jp_word ?? '-'}</TableBodyCell>
                    <TableBodyCell>{item.custom_translation ?? '-'}</TableBodyCell>
                </TableBodyRow>
            {/each}
            <TableBodyRow>

            </TableBodyRow>
        </TableBody>
    </Table>
</section>



