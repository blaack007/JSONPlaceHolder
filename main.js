// Get reference to the user list container
let list = document.getElementById("user-list");

// Ensure the user list element exists before proceeding
if (!list) {
  console.error('Element with ID "user-list" not found in the DOM.');
  throw new Error('Required DOM element "user-list" is missing.');
}

const postContainer = document.getElementById("post-container");

function scrollToPostsIfMobile() {
  if (window.innerWidth <= 480) {
    postContainer.scrollIntoView({ behavior: "smooth" });
  }
}

// Fetch all users from the JSONPlaceholder API
fetch('https://jsonplaceholder.typicode.com/users')
  .then((response) => response.json())
  .then((users) => {
    let index = 0;

    // Dynamically create a list item for each user
    for (let user of users) {
      let li = document.createElement("li");
      li.className = user.id;

      // Add user's name
      let name = document.createElement("div");
      name.className = "user-name";
      name.textContent = user.name;
      li.appendChild(name);

      // Add user's username
      let username = document.createElement("div");
      username.className = "user-username";
      username.textContent = user.username;
      li.appendChild(username);

      // Add user's email
      let email = document.createElement("div");
      email.className = "user-email";
      email.textContent = user.email;
      li.appendChild(email);

      // Add animation delay for a staggered effect
      li.style.transitionDelay = `${index * 100}ms`;
      index++;

      // Append the user item to the list
      list.appendChild(li);
    }

    // Trigger animation for user list
    revealCards('#user-list li');

    // Handle click events and automatic initial selection
    let usersLI = Array.from(document.querySelectorAll("#user-list li"));

    if (usersLI.length > 0) {
      usersLI[0].classList.add("selected");
      fetchPosts(usersLI[0].classList[0]); // Load posts for the first user
    }

    // Set up click event listeners for each user item
    usersLI.forEach(e => {
      e.addEventListener("click", _ => {
        usersLI.forEach(el => el.classList.remove("selected")); // Deselect others
        e.classList.add("selected"); // Highlight selected user
        fetchPosts(e.classList[0]); // Load posts for selected user
      });
    });
  });

/**
 * Fetch and display posts for a specific user by ID
 */
function fetchPosts(userId) {
  let cards = document.querySelector(".cards");
  cards.innerHTML = "";

  fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
    .then(res => res.json())
    .then(posts => {
      posts.forEach((post, index) => {
        cards.innerHTML += `<div class="card" style="transition-delay:${index * 50}ms;">
          <h3>${post.title}</h3>
          <p>${post.body}</p>
        </div>`;
      });

      // Trigger animation for loaded post cards
      revealCards('.card');
      scrollToPostsIfMobile();
    })
    .catch(error => {
      console.error('Failed to fetch posts:', error);
      cards.innerHTML = 'Error loading posts';
    });
}

/**
 * Animates elements as they enter the viewport using IntersectionObserver
 */
const revealCards = (selector) => {
  const cards = document.querySelectorAll(selector);

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // Stop observing once shown
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
};
