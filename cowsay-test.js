const cowsay = require('cowsay');

async function getCowList() {
  function callback(error, names) {
    if (error) {
      return ['default'];
    }
    return names;
  }
  const cows = (await cowsay.list(callback)).map((cowfile) => cowfile.split('.')[0]);
  // console.log(cows);
  const test = cows.map((cowFile) => {
    // console.log(cowFile);
    if (cowFile === 'beavis') {
      // Disabling an ESLint rule here. The name of the beavis file is
      // inconsistent with the rest of Cowsay's naming scheme, causing an error
      // eslint-disable-next-line no-param-reassign
      cowFile = 'beavis.zen';
    }
    try {
      return cowsay.say({
        text: 'moo',
        e: 'XX',
        T: 'U',
        f: cowFile || 'cow',
      }).replaceAll(/[^\x20-\x7E]/g, '');
    } catch {
      return '';
    }
  });
  const lengths = test.map((cowfile) => cowfile.length);
  console.log(lengths);
  let longest = '';
  test.forEach((file) => {
    if (file.length > longest.length) { longest = file; }
  });

  // test.forEach((cowFile) => {
  //   if (cowFile === 'beavis') {
  //     // Disabling an ESLint rule here. The name of the beavis file is
  //     // inconsistent with the rest of Cowsay's naming scheme, causing an error
  //     // eslint-disable-next-line no-param-reassign
  //     cowFile = 'beavis.zen';
  //   }
  //   if (cowsay.say({ text: 'moo', f: cowFile }).length > longest.length) {
  //     longest = cowFile;
  //   }
  // });
  console.log(longest);

  return cows;
}
// try { cowsay.say({ text: 'meow', f: 'ibm' }); } catch { console.log('meow'); }
getCowList();
