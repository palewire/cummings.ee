console.log('HELLO');

const poem = document.getElementById('poem');

function toggleNowrap() {
  const nowrapBtns = document.getElementsByName('wrap');
  const selectedNoWrap = Array.from(nowrapBtns).find((d) => d.checked).value;
  if (selectedNoWrap == 'no') {
    poem.classList.add('nowrap');
  } else {
    poem.classList.remove('nowrap');
  }
}

document.getElementsByName('wrap').forEach((r) => {
  r.onclick = toggleNowrap;
});
