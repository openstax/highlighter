import Highlighter from './Highlighter';

describe('Reference elements', () => {

  test('resolve', () => {
    document.body.innerHTML = `
      <div id="container">
        <div id="referenceElement1"></div>
        <div id="referenceElement2"></div>
        <div id="referenceElement3"></div>
      </div>
    `;

    const container = document.getElementById('container');
    const reference = document.getElementById('referenceElement2');

    const highlighter = new Highlighter(container);

    expect(highlighter.getReferenceElement('referenceElement2')).toEqual(reference);
  });

  test('do not resolve outside the container', () => {
    document.body.innerHTML = `
      <div>
        <div id="referenceElement1"></div>
        <div id="container">
          <div id="referenceElement2"></div>
          <div id="referenceElement3"></div>
        </div>
      </div>
    `;

    const container = document.getElementById('container');
    const highlighter = new Highlighter(container);

    expect(highlighter.getReferenceElement('referenceElement1')).toEqual(null);
  });
});
