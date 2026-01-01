import Array from '../../components/array/Array';

function ArraySort() {
  return (
    <div>
      <h1>Array Sort Visualization</h1>
      <Array
        values={[5, 3, 8, 1, 2]}
        states={
          new Map([
            [1, 'selected'],
            [3, 'accepted'],
            [4, 'rejected'],
          ])
        }
      />
    </div>
  );
}

export default ArraySort;
