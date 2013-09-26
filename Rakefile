SASS_SOURCE         = "app/scss"
STYLES_SOURCE       = "app/css"

# Save us from some typing
def try_to_run(command, verbose = false)
  r = system "#{command}";
  return r if r;
  $stderr.puts "Process '#{command}' exited with #{$?.exitstatus}"
  exit ($?.exitstatus)
end

desc "Run SASS to watch html/scss changed"
task 'sass-watch' do |t|
    try_to_run("sass -t compact --watch #{SASS_SOURCE}:#{STYLES_SOURCE}")
end

desc "Run unit tests"
task 'test' do |t|
    try_to_run("karma start test/karma.conf.js")
end
