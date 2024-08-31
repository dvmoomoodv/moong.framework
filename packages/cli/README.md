@moong/cli
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@moong/cli.svg)](https://npmjs.org/package/@moong/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@moong/cli.svg)](https://npmjs.org/package/@moong/cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @moong/cli
$ moong COMMAND
running command...
$ moong (--version)
@moong/cli/0.0.0 darwin-arm64 node-v21.1.0
$ moong --help [COMMAND]
USAGE
  $ moong COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`moong hello PERSON`](#moong-hello-person)
* [`moong hello world`](#moong-hello-world)
* [`moong help [COMMAND]`](#moong-help-command)
* [`moong plugins`](#moong-plugins)
* [`moong plugins add PLUGIN`](#moong-plugins-add-plugin)
* [`moong plugins:inspect PLUGIN...`](#moong-pluginsinspect-plugin)
* [`moong plugins install PLUGIN`](#moong-plugins-install-plugin)
* [`moong plugins link PATH`](#moong-plugins-link-path)
* [`moong plugins remove [PLUGIN]`](#moong-plugins-remove-plugin)
* [`moong plugins reset`](#moong-plugins-reset)
* [`moong plugins uninstall [PLUGIN]`](#moong-plugins-uninstall-plugin)
* [`moong plugins unlink [PLUGIN]`](#moong-plugins-unlink-plugin)
* [`moong plugins update`](#moong-plugins-update)

## `moong hello PERSON`

Say hello

```
USAGE
  $ moong hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ moong hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/packages/cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `moong hello world`

Say hello world

```
USAGE
  $ moong hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ moong hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/packages/cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `moong help [COMMAND]`

Display help for moong.

```
USAGE
  $ moong help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for moong.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.10/src/commands/help.ts)_

## `moong plugins`

List installed plugins.

```
USAGE
  $ moong plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ moong plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/index.ts)_

## `moong plugins add PLUGIN`

Installs a plugin into moong.

```
USAGE
  $ moong plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into moong.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the MOONG_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MOONG_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ moong plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ moong plugins add myplugin

  Install a plugin from a github url.

    $ moong plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ moong plugins add someuser/someplugin
```

## `moong plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ moong plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ moong plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/inspect.ts)_

## `moong plugins install PLUGIN`

Installs a plugin into moong.

```
USAGE
  $ moong plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into moong.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the MOONG_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the MOONG_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ moong plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ moong plugins install myplugin

  Install a plugin from a github url.

    $ moong plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ moong plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/install.ts)_

## `moong plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ moong plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ moong plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/link.ts)_

## `moong plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ moong plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ moong plugins unlink
  $ moong plugins remove

EXAMPLES
  $ moong plugins remove myplugin
```

## `moong plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ moong plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/reset.ts)_

## `moong plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ moong plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ moong plugins unlink
  $ moong plugins remove

EXAMPLES
  $ moong plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/uninstall.ts)_

## `moong plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ moong plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ moong plugins unlink
  $ moong plugins remove

EXAMPLES
  $ moong plugins unlink myplugin
```

## `moong plugins update`

Update installed plugins.

```
USAGE
  $ moong plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.6/src/commands/plugins/update.ts)_
<!-- commandsstop -->
