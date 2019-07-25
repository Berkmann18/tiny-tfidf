import { Corpus, Similarity } from './index.js';
import tape from 'tape';

tape('Unit tests for Corpus class', function (t) {
  t.plan(8);
  const corpus = new Corpus(
    ['document1', 'document2', 'document3'],
    [
      'This is test document number 1. It is quite a short document.',
      'This is test document 2. It is also quite short, and is a test.',
      'Test document number three is a bit different and is also a tiny bit longer.'
    ]
  );
  const n = corpus.getDocumentIdentifiers().length;
  t.equal(n, 3);
  const doc = corpus.getDocument('document3');
  const terms = doc.getUniqueTerms();
  // We have ignored short terms and stripped numbers, and have not yet applied stopword filtering
  t.deepEqual(terms, ['test', 'document', 'number', 'three', 'bit', 'different', 'and', 'also', 'tiny', 'longer']);
  const topTerms = corpus.getTopTermsForDocument('document3');
  // Now "and" should have been removed by stopword filtering
  t.equal(topTerms.length, 9);
  // 'bit' should have the highest weight, because it appears twice in document 3 and only in that document
  t.equal(topTerms[0][0], 'bit');
  t.equal(corpus.getTotalLength(), 22);

  const queryResults = corpus.getResultsForQuery('a bit of a test query');
  // All documents should match this query (because of the term 'test')
  t.equal(queryResults.length, 3);
  // Document 3 should be the highest ranked (because of the term 'bit')
  t.equal(queryResults[0][0], 'document3');

  const similarity1and2 = Similarity.cosineSimilarity(corpus.getDocumentVector('document1'), corpus.getDocumentVector('document2'));
  const similarity1and3 = Similarity.cosineSimilarity(corpus.getDocumentVector('document1'), corpus.getDocumentVector('document3'));
  // The first two documents should be more similar to each other than the first and third.
  t.ok(similarity1and2 > similarity1and3);
});
