const childProcess = require('node:child_process');

const originalExec = childProcess.exec;

childProcess.exec = function exec(command, options, callback) {
  const normalizedCommand = String(command).trim().toLowerCase();
  if (normalizedCommand === 'net use') {
    const done = typeof options === 'function' ? options : callback;
    if (typeof done === 'function') {
      queueMicrotask(() => done(new Error('Skipped net use lookup in restricted local runtime'), '', ''));
    }
    return {
      stdout: { on() {} },
      stderr: { on() {} },
      on() {},
      kill() {},
    };
  }

  return originalExec.apply(this, arguments);
};
