const CLIENT_ID = 'fgbcc-n0SlRCEw';
const SCOPES = ['history', 'identity'];

let upvotedPosts;

const getRedirectUri = () => {
    return window.location.origin + window.location.pathname;
}

function auth() {
    const authUri = window.snoowrap.getAuthUrl({
        clientId: CLIENT_ID,
        scope: SCOPES,
        redirectUri: getRedirectUri(),
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
        redirectUri: getRedirectUri(),
    }).then(reddit => {
        console.log('Fetching upvoted posts');

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

    const linkText = document.getElementById('link-text');
    linkText.innerHTML = randomPost.title;

    const iframe = document.getElementById('iframe');
    iframe.src = randomPost.url;
}
