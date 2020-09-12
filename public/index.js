const CLIENT_ID = 'fgbcc-n0SlRCEw';
const SCOPES = ['history', 'identity'];
const REDIRECT_URI = 'http://localhost:3000';

let upvotedPosts;

function auth() {
    const authUri = window.snoowrap.getAuthUrl({
        clientId: CLIENT_ID,
        scope: SCOPES,
        redirectUri: REDIRECT_URI,
    });
    
    window.location = authUri;
}

function fetchPosts() {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('code');

    if (!authCode) {
        console.log('No Auth Code 😠 Click Auth first');
        return;
    }

    console.log(`Authenticating with ${authCode}`);

    window.snoowrap.fromAuthCode({
        code: authCode,
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
    }).then(reddit => {
        console.log('Fetching upvoted posts')
        setInterval(() => {
            console.log(`Rate Limit Remaining: ${window.snoowrap.ratelimitRemaining}`);
        }, 60000)

        reddit.getMe().getUpvotedContent().fetchAll().then(posts => {
            console.log('Posts Fetched');
            upvotedPosts = posts;
        });
    });
}

function getRandomPost() {
    if (!upvotedPosts) {
        console.log('No upvoted posts, make sure you\'ve fetched them');
        return;
    }

    const numberOfPosts = upvotedPosts.length;
    const randomIndex = Math.floor(Math.random() * numberOfPosts);
    const randomPost = upvotedPosts[randomIndex];

    const link = document.getElementById('post-link');
    link.style.display = 'inherit';
    link.href = randomPost.url;
}
