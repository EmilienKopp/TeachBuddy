<script lang="ts">
    export let noFlip = false;
    export let noBG = false;
    export let mini = false;
    export let color: string | undefined = 'darkish';
    export let backColor = 'red';

</script>

<div class="card">
    <div class="card-side front {noBG ? '' : `${color}-gradient`}">
        <slot name="front"></slot>
    </div>
    {#if !noFlip}
    <div class="card-side back {noBG ? '' :  `color: ${backColor}-gradient`}">
        <slot name="back" ></slot>
    </div>
    {/if}
</div>


<style>

    .card-side button {
        @apply absolute left-0 w-full text-center text-4xl;
    }

    button.go-up {
        @apply top-0;
    }

    button.go-down {
        @apply bottom-0;
    }

    .card {
        perspective: 150rem;
        box-shadow: none;
        background: none;
        @apply h-full w-full;
    }

    .card-side {
        display: block;
        transition: all 0.9s ease;
        backface-visibility: hidden;
        @apply absolute top-0 left-0 h-full w-full p-4 text-white rounded-xl;
    }

    .card-side.back {
        transform: rotateY(-180deg);
        @apply drop-shadow-lg shadow-blue-200;
    }

    .card-side.front {
        @apply drop-shadow-md shadow-orange-200;
    }

    .card:hover .card-side.front {
        transform: rotateY(180deg);
    }

    .card:hover .card-side.back {
        transform: rotateY(0deg);
    }

    .rocketship {
        cursor:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='80' height='112' viewport='0 0 100 100' style='fill:black;font-size:56px;'><text y='50%'>🚀</text></svg>") 16 0,auto; /*!emojicursor.app*/
    }

    .no-gradient {
        background: #000;
        border: 1px solid rgba(0,0,0,0.8);
    }

    .blue-gradient {
        background-color: #009898;
        background-image: linear-gradient(25deg, #0077ff 0%, #5892e7 50%,  #e8e8e8 100%);
    }

    .red-gradient {
        background-color: #f5f5f5;
        background-image: linear-gradient(25deg, #f79393 0%, #f79888 50%,  #e8e8e8 100%);
    }

    .green-gradient {
        background-color: #f5f5f5;
        background-image: linear-gradient(25deg, #00ff15 0%, #74e27d 50%,  #e8e8e8 100%);
    }

    .yellow-gradient {
        background-color: #f5f5f5;
        background-image: linear-gradient(25deg, #ff9317 0%, #ffb259 50%,  #e8e8e8 100%);
    }

    .darkish-gradient {
        background-color: #f5f5f5;
        background-image: linear-gradient(25deg, #282828 0%, #696666 50%,  #e8e8e8 100%);
    }


</style>