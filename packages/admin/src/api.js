import { Base64 } from 'js-base64';
import Octokat from 'octokat';

let user = {};
let octo = null;
let repo = null;
try {
  user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
} catch (e) {
  reset();
}
user = user || {};

function reset() {
  localStorage.clear();
  sessionStorage.clear();
}

if (!user.name) {
  reset();
} else {
  octo = new Octokat({
    username: user.name,
    password: Base64.decode(user.password)
  });
  repo = octo.repos(user.name, 'blog');
}

export { octo, repo, user };

