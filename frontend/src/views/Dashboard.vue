
<template>
  <form @submit.prevent="handleSubmit">


    <input type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box">
        <div class="form-control w-full ">
          <label class="label"> <span class="label-text">Song name</span> </label>
          <input v-model="state.name" type="text" placeholder="Type here" class="input input-bordered w-full" />
          <label class="label"> <span class="label-text">Song author</span> </label>
          <input v-model="state.author" type="text" placeholder="Type here" class="input input-bordered w-full" />
          <label class="label"> <span class="label-text">Album name</span> </label>
          <input v-model="state.album" type="text" placeholder="Type here" class="input input-bordered w-full" />
          <label class="label"> <span class="label-text">Release Date</span> </label>
          <input v-model="state.release" type="date" placeholder="Type here" class="input input-bordered w-full" />
          <label class="label"> <span class="label-text">Image imageUrl</span> </label>
          <input v-model="state.imageUrl" type="text" placeholder="Type here" class="input input-bordered w-full" />
          <label class="label"> <span class="label-text">Song post title</span> </label>
          <input v-model="state.songTextTitle" type="text" placeholder="Type here" class="input input-bordered w-full" />
          <label class="label"> <span class="label-text">Song post description</span> </label>
          <textarea v-model="state.songTextDesc" class="textarea textarea-bordered" placeholder="Bio"></textarea>

        </div>
        <div class="modal-action">
          <label for="my-modal" style="background-color: red;" class="btn">Close</label>
          <!-- <label for="my-modal" class="btn">Create</label> -->
          <button style="color: white; background-color: #3D4451; font-size: 14px; padding: 0 16px; width: 82px;"  type="submit">Create</button>

        </div>

      </div>
    </div>
  </form>

  <div class="w-full my-5" style="display: flex; justify-content: end; align-items: center;">
    <label for="my-modal" class="btn">Add new song</label>
  </div>
  <div class="overflow-x-auto w-full">
    <table class="table w-full">
      <!-- head -->
      <thead>
        <tr>

        <tr>

          <th>Name</th>
          <th>Author</th>
          <th>Album</th>
          <th>Release</th>
          <th>Delete</th>
        </tr>

        </tr>
      </thead>
      <tbody>
        <!-- row 1 -->
        <tr v-for="song in songs" :key="song.id">

          <td>
            <div class="flex items-center space-x-3">
              <div class="avatar">
                <div class="mask mask-squircle w-12 h-12">
                  <RouterLink :to="`/s/${song.id}`"> <img :src="song.imageUrl" :alt="song.name" /></RouterLink>
                 
                </div>
              </div>
              <div>
                <RouterLink :to="`/s/${song.id}`"> {{ song.name }}</RouterLink>

                <!-- <div class="font-bold">{{ song.name }}</div> -->
              </div>
            </div>
          </td>

          <td>{{ song.author }}</td>
          <td>
            {{ song.album }}
          </td>
          <td>{{ formatDate(song.release) }}</td>
          <th>
            <button @click="handleDelete(song.id)" class="btn btn-ghost btn-xs">Delete</button>
          </th>
        </tr>

      </tbody>
      <!-- foot -->
      <tfoot>
        <tr>

          <th>Name</th>
          <th>Author</th>
          <th>Album</th>
          <th>Release</th>
          <th>Delete</th>
        </tr>
      </tfoot>

    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { $http } from '../utils/http';
import { Router } from 'express';

const state = reactive({
  name: '',
  author: '',
  album: '',
  release: null,
  imageUrl: '',
  songTextTitle: '',
  songTextDesc: ''

})


interface ISong {
  id: string,
  name: string,
  author: string,
  album: string,
  imageUrl: string,
  songTextTitle: string,
  songTextDesc: string,
  release: string
}

const songs = ref([] as ISong[])

onMounted(async () => {
  const data = await $http.get('/songs/getAllSongs')
  songs.value = data
})

const handleSubmit = async () => {
  const response = await $http.post('/songs/createSong', { name: state.name, author: state.author, album: state.album, release: state.release, imageUrl: state.imageUrl, songTextTitle: state.songTextTitle, songTextDesc: state.songTextDesc })
    songs.value.push(response as any)
}

const handleDelete = async (id: string) => {
  await $http.delete(`/songs/deleteSong/${id}`)
  songs.value = songs.value.filter(song => song.id !== id)

}
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>
