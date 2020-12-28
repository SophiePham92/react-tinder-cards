export function debounce(callback, wait) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

export function getLocalViewedProfiles(){
    return JSON.parse(localStorage.getItem('viewedProfiles')) || []
}

export function setLocalViewedProfiles(viewedProfiles){
    localStorage.setItem('viewedProfiles', JSON.stringify(viewedProfiles))
}