<?php

require_once __DIR__ . "/index-to-rename.php";
require_once "index-to-rename.php";

class Index
{
    private $testRename;

    public function __construct()
    {
        echo "Hello from Index.";
        $this->testRename = new TestRename();
        $result = $this->testRename->test();
    }
}

$index = new Index();
