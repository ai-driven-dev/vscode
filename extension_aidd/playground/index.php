<?php

require_once __DIR__ . '/index-to-rename.php';

// test your snippets here

class Index
{
    private $testRename;

    public function __construct()
    {
        $this->testRename = new TestRename();
        $result = $this->testRename->test();
    }
}
