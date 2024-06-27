"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  const $storyMakeUp=  $(`
      <li id="${story.storyId}" class="" >
       <input type="checkbox" class="favorite-box" />
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <button class="delete-button">Delete</button>
      </li>
      <hr>
    `);
    ;

//  THis is the favorite controller. I attempted to make it into a function of it's own but i couldn't 
    $storyMakeUp.find('.favorite-box').on('change', async function() {
      if (currentUser) {
        const isChecked = $(this).is(':checked');
  
        if (isChecked) {
          await currentUser.addFavorite(story.storyId);
          $(this).parent('li').addClass('checked');
        } else {
          await currentUser.removeFavorite(story.storyId);
          $(this).parent('li').removeClass('checked');
        }
  
        console.log("Favorite status updated:", currentUser.favorites);
      }
    });

//  THis is the delete controller. I attempted to make it into a function of it's own but i couldn't 
  //   $storyMakeUp.find('.delete-button').on('click', async function() {
  //     if (currentUser) {  
  //       console.log("delete")
  //       $(this).parent("li").remove();
  //     }
  // });

  async function removeAndRefreshStory(storyId) {
   
        await storyList.removeStory(currentUser, storyId);
        $(`#${storyId}`).remove(); // Remove from DOM
        console.log("Story removed:", storyId);
   
}

// Example usage for deleting a specific story
$('.delete-button').on('click', function() {
    const storyId = $(this).closest('li').attr('id');
    removeAndRefreshStory(storyId);
});
  
    return $storyMakeUp;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $allStoriesList.empty();

  for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      if (story.isChecked) {
          $story.addClass('checked'); // Add 'checked' class if story is favorited
      }
      $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
