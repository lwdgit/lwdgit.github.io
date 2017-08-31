import { Base64 } from 'js-base64';
import Octokat from 'octokat';

let user = {};
let octo = null;
let repo = null;
let base = null;

function reset() {
  localStorage.clear();
  sessionStorage.clear();
}

function getUser() {
  try {
    user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
  } catch (e) {
    reset();
  }
  user = user || {};
  if (!user.name) {
    reset();
  } else {
    octo = new Octokat({
      username: user.name,
      password: Base64.decode(user.password)
    });
    repo = octo.repos(user.name, 'blog');
    base = octo.repos(user.name, window.location.host);
  }
}

export { octo, repo, base, user, getUser };
