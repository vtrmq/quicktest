<script lang="ts">
import { page } from '$app/state';
import { LinkBack } from "$lib/components";
import { extractYouTubeId, filtrarParametros } from "$lib/utils";
let { data } = $props();
let content = JSON.parse(data.topic.content);
const search = filtrarParametros(page.url.href, ['teacherId', 'courseId', 'subjectId']);
</script>

<div class="content">
  <div class="content-body">
    <div class="header-content">
      <LinkBack href="/student/subject/topic?{search}">Temas</LinkBack>
    </div>
    {#each content as section}
      {#if section.type === 'title'}
        <h1>{section.text}</h1>
      {:else if section.type === 'subtitle'}
        <h2>{section.text}</h2>
      {:else if section.type === 'paragraph'}
        <p>{section.text}</p>
      {:else if section.type === 'image'}
        <div class="container-image">
          <div class="wr-img" style="width: {section.size}%">
            <img class="image" src={section.text} alt=""/>
          </div>
        </div>
      {:else if section.type === 'video'}
        <div class="container-iframe">
          <div class="wr-iframe">
            <iframe
              class="iframe"
              src={extractYouTubeId(section.text)}
              title="Video de YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      {:else if section.type === 'vignette'}
        <div class="wr-items">
          <ul class="ul-items">

            {#each section.text as list, index}
              <li class="li-item">
                <div class="n-item">{index < 9 ? '0' : ''}{index + 1}</div>
                <div class="text-list">{list.item}</div>
              </li>
            {/each}

          </ul>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style>
.content {
  padding: 1em 0 5em;
  margin: 0 auto 4em;
}
@media (min-width: 700px) {
  .content {
    padding: 1em 0 2em;
    margin: 0 auto 6em;
    max-width: 600px;
  }
}
</style>
