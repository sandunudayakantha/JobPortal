import buffer from 'buffer';

if (buffer && !buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}
