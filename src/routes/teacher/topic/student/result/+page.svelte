<script lang="ts">
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { filtrarParametros, extractParams } from "$lib/utils";
    import { Toast } from "$lib/components";

    import {
        HeaderExercise,
        ListExercisesResult,
        Match,
        Morphosyntax,
        PointOut,
        SelectWord,
        Character,
        Test,
        TestPDF,
        TestFS,
        LinkBack,
    } from "$lib/components";

    let { data } = $props();
    let visible = $state(false);
    let toast = $state<Toast | null>(null);
    const search = filtrarParametros(page.url.href, [
        "topicId",
        "courseId",
        "subjectId",
        "activityId",
        "origin",
    ]);

    const back = extractParams(page.url.href, ["origin"]);
    let scales = data.info?.scales;
    let type_activity = data.info?.activity.type_general;

    type Item = {
        exercise: {};
        points: [];
        type: string;
    };

    type Info = {
        activity: { activity: string };
        activityId: number;
        courseId: number;
        origin: string;
        scales: object;
        subjectId: number;
        teacherId: number;
        topic: string;
        topicId: number;
    };

    let items = data.items;
    let type = $state("info");
    let containerBody = $state() as HTMLDivElement;
    let info: Info = data.info as Info;
    let indexExercise = $state(-1);

    let infoData = $state();
    let viewResult = $state(0);

    onMount(() => {
        visible = true;
    });

    function handleActivity(
        index: number,
        _items: Item[],
        _viewResult: number,
    ) {
        viewResult = _viewResult;
        if (index !== -1) {
            visible = false;
            type = _items[index].type;
            indexExercise = index;
            infoData = _items[index];
            setTimeout(() => {
                visible = true;
            }, 200);
        }

        setTimeout(() => {
            if (containerBody) {
                containerBody.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });
            }
        }, 200);
    }

    function handleViewResult(_viewResult: number) {
        viewResult = _viewResult;
    }

</script>

<Toast bind:this={toast} />

{#if visible}
    <HeaderExercise>
    {#if back.origin === "inbox"}
      <LinkBack
        href="/teacher/inbox"
        --color-link="#fff">Volver</LinkBack
      >
    {:else if back.origin === "topic" || back.origin === "assign"}
      <LinkBack
        href="/teacher/topic/student?{search}"
        --color-link="#fff">Volver</LinkBack
      >
    {/if}
        <ListExercisesResult
            {info}
            {items}
            {handleActivity}
            {handleViewResult}
        />
    </HeaderExercise>

    <div class="container-body" bind:this={containerBody} transition:fade>
        {#if type === "info"}
            <div class="container-info">
                <h1 class="topic">{info.topic}</h1>
                <h2 class="activity">{info.activity.activity}</h2>
            </div>
        {:else}
            {#key indexExercise}
                {#if type === "match"}
                    <Match
                        {type_activity}
                        {viewResult}
                        {scales}
                        {indexExercise}
                        {infoData}
                        isActionStudent = {false}
                    />
                {:else if type === "morphosyntax"}
                    <Morphosyntax
                        {type_activity}
                        {viewResult}
                        {scales}
                        {indexExercise}
                        {infoData}
                        isActionStudent = {false}
                    />
                {:else if type === "point-out"}
                    <PointOut
                        {type_activity}
                        {viewResult}
                        {scales}
                        {indexExercise}
                        {infoData}
                        isActionStudent = {false}
                    />
                {:else if type === "select"}
                    <SelectWord
                        {type_activity}
                        {viewResult}
                        {scales}
                        {indexExercise}
                        {infoData}
                        isActionStudent = {false}
                    />
                {:else if type === "character"}
                    <Character
                        {type_activity}
                        {viewResult}
                        {scales}
                        {indexExercise}
                        {infoData}
                        isActionStudent = {false}
                    />
                {:else if type === "test"}
                    <Test
                        {type_activity}
                        {viewResult}
                        {scales}
                        {indexExercise}
                        {infoData}
                        isActionStudent = {false}
                    />
                {:else if type === "test-pdf"}
                    <TestPDF
                        {type_activity}
                        {viewResult}
                        {scales}
                        {indexExercise}
                        {infoData}
                        isActionStudent = {false}
                    />
                {:else if type === "test-fs"}
                    <TestFS
                        {type_activity}
                        {viewResult}
                        {scales}
                        {indexExercise}
                        {infoData}
                        isActionStudent = {false}
                    />
                {/if}
            {/key}
        {/if}
    </div>
{/if}

<style>
    .container-info {
        padding: 2em 0;
    }
    .topic {
        font-size: 1.7em;
        font-family: var(--font-bold);
        text-align: center;
        margin-bottom: 0.3em;
    }
    .activity {
        font-family: var(--font-normal);
        font-size: 1.2em;
        font-weight: 500;
        text-align: center;
    }
    .container-body {
        position: absolute;
        top: var(--height-header);
        width: 100%;
        height: calc(100% - var(--height-header));
        overflow-y: auto;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 1em 0.5em;
    }
</style>
