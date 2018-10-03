import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Alignment, { calc } from './sequence-alignment';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

const gap = -5;
const gc = "-";

const S = [
  [10, -1, -3, -4],
  [-1, 7, -5, 3],
  [-3, -5, 9, 0],
  [-4, -3, 0, 8]
];

const proteins = ['A', 'G', 'C', 'T'];

const values = [
  { A: 1},
  { G: 2 },
  { C: 3 },
  { T: 4 }
]

class App extends Component {
  state = {
    fileName: '',
    content: null,
    sequence1: [],
    sequence2: [],
    align: {
      sequence: [[], []],
      arr: []
    },
    loading: false,
    sq1: '',
    sq2: ''
  }

  readFileContent = (file) => {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result)
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    })
  }

  
  placeFileContent = (file) => {
    this.readFileContent(file).then(content => {

      const sequence1 = content.slice(content.indexOf('1') + 1, content.indexOf('>Secuencia de prueba 2')).replace(/\s/g,'');
      const sequence2 = content.slice(content.indexOf('2') + 1, content.length).replace(/\s/g,'');
        
      this.setState({
        fileName: file.name,
        content, 
        sq1: sequence1,
        sq2: sequence2,
        sequence1: [...sequence1],
        sequence2: [...sequence2]
      });
    }).catch(error => console.log(error))
  }

  onChange = (e) => {
    const input = e.target
    if ('files' in input && input.files.length > 0) {
      this.placeFileContent(input.files[0])
    }
  }

  renderMatrix = ({ arr, maximos }) => {

    const { sequence1, sequence2, sq1, sq2 } = this.state;

    return (
      arr.length > 0 && <div className="matrix">
        <div className="row">
          <span className="by" />
          <span className="by" />
          {sequence1.map((s) => <span className="by">{s}</span>)}
        </div>
        {arr.map((row, i) => {
          return (
            <div className="row">
  
              <span className="by">{sequence2[i -1]}</span>
              {row.map((cell, j) => {
                let className = 'bg ';

                if (j === 0 || i === 0) {
                  className = 'br ';
                }

                const maximo = maximos[cell];
                if (maximo) {
                  if (maximo[0] === i && maximo[1] === j) {
                    className = className.concat('is')
                  }
                } 

                // toltip max - pintar
              
                const { parcial } = calc(i, j, arr, sq1, sq2);

                return (
                  <span className={className}>
                    <Tooltip title={`max: ${ parcial }`}>
                      <div>{cell}</div>
                    </Tooltip>                    
                  </span>
                )
              })}    
            </div>
          )
        })}
      </div>
    )
  }

  align = () => {
    const { sequence1, sequence2 } = this.state;

    this.setState({
      align: Alignment(sequence1, sequence2),
      loading: true
    })

    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 2000)
  }

  render() {
    const { align, fileName, sequence1, sequence2, loading } = this.state;
    const sq1 = align.sequence[0];
    const sq2 = align.sequence[1];

    return (
      <div className="App">
        <header className="App-header">
          <div className="head">
            <div className="s w3">
              <h5>S[]</h5>
              {
                S.map((row) => {
                  return (
                    <div className="sq1">
                      {row.map((cell) => (<span className="bg">{cell}</span>))}
                    </div>
                  );
                })
              }
            </div>
            <img src={logo} className="App-logo" alt="logo" />
            <div className="w3 flex">
              <h5>GAP <span className="yellow">{gap}</span></h5>
              <h5>GC <span className="yellow">{gc}</span></h5>
              <div className="vertical">
                {values.map((v) => (
                  <div className="sq1">
                    <span>{Object.keys(v)[0]}</span>
                    <span className="yellow">{v[Object.keys(v)[0]]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="file-input">
            <input type="file" onChange={this.onChange} />
            <span className="button">Choose</span>
            <label className="label">{fileName || 'No file selected'}</label>
          </div>
        
          {fileName &&
            <Button variant="extendedFab" onClick={this.align}>
              {loading ? <CircularProgress /> : 'Alignment'}
            </Button>
          }
          
          {
            sequence1.length > 0 &&
            <React.Fragment>
              <hr />

              <h5>Sequence 1</h5>

              <div className="sequences">
                <div className="sq1">
                  {sequence1.map((c, i) => (<span key={i}>{c}</span>))}
                </div>
              </div>
            </React.Fragment>
          }
          {
            sequence2.length > 0 &&
            <React.Fragment>
              <hr />

              <h5>Sequence 2</h5>

              <div className="sequences">
                <div className="sq1">
                  {sequence2.map((c, i) => (<span key={i}>{c}</span>))}
                </div>
              </div>
            </React.Fragment>
          }

          {!loading ?
            <React.Fragment>
              <hr />

              <h3>Alignment {align.score && <span className="yellow">( Score {align.score} )</span>}</h3>

              <div className="sequences">
                <div className="sq1">
                  {sq1.map((c, i) => {
                    let className = 'yellow';
                  
                      if (sq2[i] === '-' || c === '-') {
                        className = 'red';
                      } else if (sq2[i] === c) {
                        className = 'green';
                      }

                      return (<span key={i} className={className}>{c}</span>);
                    })
                  }
                </div>
                <div className="sq2">
                  {sq2.map((c, i) => {
                    let className = 'yellow';
                  
                      if (sq1[i] === '-' || c === '-') {
                        className = 'red';
                      } else if (sq1[i] === c) {
                        className = 'green';
                      }

                      return (<span key={i} className={className}>{c}</span>);
                    })
                  }
                </div>
              </div>

              <hr />

              <h3>F[]</h3>
              {this.renderMatrix(align)}
            </React.Fragment> : <CircularProgress />
          }
        </header>
      </div>
    );
  }
}

export default App;
