# Full Stack Development Task

Welcome to the Full Stack Development Task! 🚀 In this task, you'll embark on an exciting journey to create a robust and feature-rich Signin/Signup system with JWT authentication. This system will seamlessly integrate with Redis and DynamoDB/MongoDB to ensure security and efficiency. Let's dive into the workflow!

## Step 1: Building a Secure Signin/Signup System

### Backend Magic ✨
Our journey begins with setting up a dynamic Node.js server using the power of Express.js. To ensure top-notch security, we're harnessing the capabilities of Passport.js. The authentication process will be powered by the creation and validation of JWT tokens through the magic of the jsonwebtoken library. Managing these tokens will be a breeze, thanks to the integration of Redis. And don't worry, user credentials will be stored safely in DynamoDB or MongoDB, ensuring that user data remains under lock and key.

### Navigating Through Routes 🛤️
- `/signup`: New users can easily register and set foot into our digital world.
- `/signin`: Registered users can effortlessly log in and access their personalized experience.
- `/auth/google`: Feel the convenience of Google OAuth for quick and secure access.
- `/auth/github`: Dive into the GitHub OAuth waters for a seamless login experience.

## Step 2: Tailoring the Experience with User Type Selection

### The Frontend Canvas 🎨
After a successful signup or signin, users are greeted with the choice to define their identity: Developer, Organization, or Company. This personalization elevates the user experience and ensures a tailored journey.

### Behind the Scenes 🎬
The user's chosen identity is meticulously stored in DynamoDB or MongoDB, providing a foundation for a curated experience.

## Step 3: Choosing the Hosting Adventure

### The Frontend Choice 🌐
The power of choice continues! Users can pick between Self Hosting or XeroCode Hosting. If the self-hosting route is chosen, two titans await: AWS and GitHub.

### The Backend Blueprint 📚
The user's hosting preference is diligently recorded in DynamoDB or MongoDB, a blueprint for future endeavors.

## Step 4: GitHub Integration - Your Coding Companion 🤖

### Frontend Progress 🔍
Opting for GitHub hosting leads users to a smooth path of GitHub App installation. Just a few clicks away, and the App will be integrated into your GitHub repository.

### Backend Integration 🛠️
The GitHub Apps API becomes your ally, ensuring the integration process is seamless. Once the App is installed, the backend deftly fetches both public and private repositories, setting the stage for what's next.

## Displaying the Repositories - Your World of Repos 📚

The frontend takes center stage, showcasing the repositories fetched from GitHub. The user is now empowered to choose repositories, an essential step in crafting their digital domain.

**A Glimpse of Our Creation**: Visit our Frontend at [https://xerocodee-fullstack-assignment.netlify.app/](https://xerocodee-fullstack-assignment.netlify.app/) and dive into the backend api at [https://xerocodee-e5rc.onrender.com](https://xerocodee-e5rc.onrender.com). The [https://github.com/DarshanAnandu/Xerocode-Frontend/tree/master](Fronend Repository) and the [https://github.com/DarshanAnandu/Xerocode-Backend/tree/master](Backend Repository).

This journey weaves together intricate backend technologies, elegant frontend interfaces, and the power of choice, resulting in a Full Stack masterpiece. Let's build a digital world that caters to every user's uniqueness! 🌟👩‍💻👨‍💻